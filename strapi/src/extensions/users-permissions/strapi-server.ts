import utils from "@strapi/utils";
import { Context } from "koa";
import _ from "lodash";
import {
  validateCallbackBody,
  validateCreateUserBody,
} from "../../../utils/user-validation";
// import { ROLE } from '../../../utils/constant';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "process";
import {
  sendConfirmationEmail,
  sendUrlToChangePasswordEmail,
  sendUrlToRecoveryPasswordEmail,
} from "../../../utils/send-email-registration";
import tenant from "../../api/tenant/controllers/tenant";

type CompanyData = {
  name: string;
  address: string;
  zipcode: string;
  country: string;
  city: string;
};

const { ApplicationError, ValidationError, ForbiddenError } = utils.errors;

const sanitizeOutput = async (user: any, ctx: Context) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return strapi.contentAPI.sanitize.output(user, schema, { auth });
};

const getService = (name: string) => {
  return strapi.plugin("users-permissions").service(name);
};

const sanitizeQuery = async (query, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return strapi.contentAPI.sanitize.query(query, schema, { auth });
};

const validateQuery = async (query, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return strapi.contentAPI.validate.query(query, schema, { auth });
};

export default (plugin: any) => {
  plugin.controllers.user.create = async (ctx: Context) => {
    try {
      const advanced = (await strapi
        .store({ type: "plugin", name: "users-permissions", key: "advanced" })
        .get()) as any;

      console.log("advanced", advanced);

      await validateCreateUserBody(ctx.request.body);

      const {
        email,
        username,
        role,
        role_code,
        country,
        lang_pref,
        lang_conv, 
        firstname,
        lastname
      } = ctx.request.body;

      const company: CompanyData | null = ctx.request.body.company_id;
      const userWithSameUsername = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { username } });

      if (userWithSameUsername) {
        return ctx.badRequest("username already taken");
      }

      if (advanced.unique_email) {
        const userWithSameEmail = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({ where: { email: email.toLowerCase() } });
        if (userWithSameEmail) {
          return ctx.badRequest("Email already taken");
        }
        //   user admin panel backend
        const adminUsers = await strapi
          .query("admin::user")
          .findOne({ where: { email: email.toLowerCase() } });
        const test = await strapi.query("admin::user").findMany({
          populate: true,
        });
        console.log("test", test);

        if (adminUsers) {
          return ctx.badRequest("Email already taken");
        }
      }
      let hashedPassword = null;
      // if(password){
      //   hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
      // }
      const user = {
        ...ctx.request.body,
        password: hashedPassword,
        email: email.toLowerCase(),
        provider: "local",
      };

      if (!role) {
        const defaultRole = await strapi
          .query("plugin::users-permissions.role")
          .findOne({ where: { type: advanced.default_role } });

        user.role = defaultRole.id;
      }
      const adminPanelRole = await strapi.db
        .query("admin::role")
        .findOne({ where: { code: role_code } });
      if (!adminPanelRole) {
        throw new ApplicationError("Role not found");
      }
      try {
        let companyData = null;
        console.log("company after", company);

        if (
          company &&
          company.name &&
          company.country &&
          company.address &&
          company.zipcode &&
          company.city
        ) {
          // companyData = await strapi.query("api::company.company").findOne({
          //   where: {
          //     name: company.name,
          //     country: company.country,
          //     address: company.address,
          //     zipcode: company.zipcode,
          //   },
          // });
          console.log("company before", company);
          companyData = await strapi.query("api::company.company").create({
            data: { ...company },
          });
        }
        const userData = await strapi.db
          .query("plugin::users-permissions.user")
          .create({
            data: {
              ...user,
              lang_conv,
              lang_pref,
              confirmed: false,
              blocked: false,
              role_admin: adminPanelRole.id,
              company_id: company ? companyData.id : null,
              country: companyData ? companyData.country : country,
            },
          });
        if (!userData) {
          throw new ApplicationError("User not created");
        }
        const tenantCreation = await strapi.db.query("api::tenant.tenant").create({
          data: { name: company?.name ?? `${firstname} ${lastname}`, publishedAt: new Date(),locale: "en"},
        })
        if(!tenantCreation){
          throw new ApplicationError("Tenant not created");
        }
        const tenantMembership = await strapi.db.query("api::tenant-membership.tenant-membership").create({
          data: { user: userData.id, tenant: tenantCreation.id, role: "owner",publishedAt: new Date(), locale: "en"},
        })
        if(!tenantMembership){
          throw new ApplicationError("Tenant membership not created");
        }
        const [sanitizedData, userAdminPanelData] = await Promise.all([
          await sanitizeOutput(userData, ctx),
          await strapi.db.query("admin::user").create({
            data: { ...user, isActive: false, roles: adminPanelRole.id },
          }),
        ]);
        // delete user permissions from plugin if user admin is not created
        if (!userAdminPanelData || !sanitizedData) {
          await strapi.db.query("plugin::users-permissions.user").delete({
            where: {
              id: userData.id,
            },
          });
          throw new ApplicationError("User not created");
        }
        const registrationToken = jwt.sign(
          { id: userData.id, admin_user_id: userAdminPanelData.id },
          env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const data = await getService("user").edit(userData.id, {
          registration_token: registrationToken,
        });

        //  send email to the user
        await sendConfirmationEmail(strapi, {
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          registrationToken: registrationToken,
        });

        ctx.created(data as any);
      } catch (error) {
        throw new ApplicationError(error.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return ctx.internalServerError("Failed to create user");
    }
  };

  // edit

  plugin.controllers.user.update = async (ctx: Context) => {
    console.log("UPDATIIIIIIIIIIIIIIIING THE USER...................");
    const userId = ctx.params.id;
    const {
      title,
      firstname,
      lastname,
      email,
      country,
      name,
      address,
      city,
      zipcode,
      lang_pref,
      lang_conv,
      photo,
      company_id,
      plan,
    } = ctx.request.body;
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: { id: userId },
    });
    if (!user) {
      return ctx.notFound("User not found");
    }

    if (plan) {
      const userUpdateInfo = await strapi.query("plugin::users-permissions.user").update({
        where: { id: userId },
        data: { plan }
      });
      console.log(userUpdateInfo)
    }

    const adminUser = await strapi.query("admin::user").findOne({
      where: { email },
    });
    if (!adminUser) {
      return ctx.notFound("User not found");
    }
    if (company_id) {
      const company = await strapi.query("api::company.company").findOne({
        where: {
          id: company_id.id,
        },
      });
      if (!company) {
        return ctx.notFound("Company not found");
      }
      await strapi.query("api::company.company").update({
        where: { id: company_id.id },
        data: {
          name,
          address,
          city,
          zipcode,
          country,
        },
      });
    }
    await strapi.query("plugin::users-permissions.user").update({
      where: { id: userId },
      data: {
        title,
        lang_pref,
        lang_conv,
        firstname,
        lastname,
        country,
        name,
        address,
        city,
        zipcode,
        photo,
        company_id: company_id ? company_id.id : null,
      },
    });
    await strapi.query("admin::user").update({
      where: { email },
      data: {
        firstname,
        lastname,
      },
    });
    return ctx.send({ message: "User updated successfully" });
  };

  // auth

  // const originalCallback = plugin.controllers.auth.callback;
  plugin.controllers.auth.callback = async (ctx: Context) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = strapi.store({ type: "plugin", name: "users-permissions" });
    const grantSettings = await store.get({ key: "grant" });

    const grantProvider = provider === "local" ? "email" : provider;

    if (!_.get(grantSettings, [grantProvider, "enabled"])) {
      throw new ApplicationError("This provider is disabled");
    }
    console.log("grantSettings", grantProvider);

    if (provider === "local") {
      await validateCallbackBody(params);

      const { identifier } = params;

      // Check if the user exists.
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            $or: [{ email: identifier.toLowerCase() }],
          },
          populate: true,
        });

      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }

      if (!user.password) {
        throw new ValidationError("Invalid identifier or password");
      }

      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      }

      const advancedSettings = await store.get({ key: "advanced" });
      const requiresConfirmation = _.get(
        advancedSettings,
        "email_confirmation"
      );

      if (requiresConfirmation && user.confirmed !== true) {
        throw new ApplicationError("Your account email is not confirmed");
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }
      delete user.password;
      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: user,
      });
    }

    // Connect the user with the third-party provider.
    try {
      const user = await getService("providers").connect(provider, ctx.query);
      const populatedUser = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { email: user.email }, populate: true });

      if (user.blocked) {
        throw new ForbiddenError(
          "Your account has been blocked by an administrator"
        );
      }

      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: populatedUser,
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  };

  plugin.controllers.user.me = async (ctx: Context) => {
    try {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          populate: {
            role_admin: true,
            company_id: true,
            photo: {
              fields: ["url", "name", "formats"],
            },
          },
        }
      );
      return ctx.send(user);
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  };

  // Token

  plugin.controllers.user;

  /**
   *
   * @param ctx
   * jwt token data in query (id, admin_user_id)
   */
  plugin.controllers.auth.registrationCheck = async (ctx: Context) => {
    // params
    const token = ctx.query.token;
    console.log("toekn", token);
    if (!token) {
      throw new ApplicationError("Missing registration token");
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    if (!decoded) {
      throw new ApplicationError("Invalid registration token");
    }
    const { id, admin_user_id } = decoded as any;
    if (!id || !admin_user_id) {
      throw new ApplicationError(
        "Invalid registration token! Id and user admin id are missing"
      );
    }
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return ctx.badRequest("User not found");
    }
    if (
      user.registration_token === token ||
      user.resetPasswordToken === token
    ) {
      delete user.password;
      delete user.registration_token;
      delete user.reset_password_token;
      return ctx.send({ data: { ...user, admin_user_id: admin_user_id } });
    } else {
      return ctx.badRequest("Invalid  token");
    }
  };

  plugin.controllers.auth.invitationCheck = async (ctx: Context) => {
    // params
    const token = ctx.query.token;
    console.log("token", token);
    if (!token) {
      throw new ApplicationError("Missing invitation token");
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    if (!decoded) {
      throw new ApplicationError("Invalid invitation token");
    }
    const { tenantId } = decoded as any;
    if (!tenantId) {
      throw new ApplicationError(
        "Invalid invitation token! Tenant id is missing"
      );
    }
    console.log("tenantId", tenantId);

    const tenant = await strapi.query("api::tenant-membership.tenant-membership").findOne({
      populate: {
        tenant: true,
      },
      where: {
        id: tenantId,
      },
    });
    console.log("tenant", tenant);
    return ctx.send({ data: { tenant } });
  };

  plugin.controllers.auth.acceptInvitation = async (ctx: Context) => {
    console.log("Accept invitation");
    const { tenantId } = ctx.request.body;
    console.log("tenantId", tenantId);
    if (!tenantId) {
      throw new ApplicationError("Missing tenant id");
    }

    console.log("ctx.state.user", ctx.state.user);
    const user = ctx.state.user;
    if (!user) {
      throw new ApplicationError("User not found");
    }

    const userTenant = await strapi.query("api::tenant-membership.tenant-membership").findOne({
      populate: {
        tenant: true,
        user: true
      },
      where: {
        user: user.id,
      },
    });
    console.log("userTenant", userTenant);
    if (!userTenant) {
      throw new ApplicationError("User not found");
    }
    if (userTenant.user.id !== user.id) {
      throw new ApplicationError("User has no access to this tenant");
    }
    console.log("tenantId", tenantId);
    const tenant = await strapi.query("api::tenant-membership.tenant-membership").update({
      where: {
        id: tenantId,
      },
      data: {
        is_registred: true,
      },
    });
    console.log("tenant", tenant);
    return ctx.send({ data: { tenant } });
  };


  // init password after registration
  plugin.controllers.auth.initPasswordAfterRegistration = async (
    ctx: Context
  ) => {
    const { password, confirmPassword, id, admin_user_id } = ctx.request.body;
    if (!password || !confirmPassword || !id || !admin_user_id) {
      return ctx.badRequest("Missing credentials");
    }
    let hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);

    const [user, adminUser] = await Promise.all([
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: id },
        data: {
          password: hashedPassword,
          confirmed: true,
          registration_token: null,
          resetPasswordToken: null,
        },
      }),
      await strapi.query("admin::user").update({
        where: { id: admin_user_id },
        data: {
          password: hashedPassword,
          isActive: true,
          registration_token: null,
        },
      }),
    ]);
    if (!user || !adminUser) {
      return ctx.badRequest("User not updated");
    }
    ctx.send({ message: "Password updated successfully", status: 200 });
  };

  // change password

  plugin.controllers.user.recoveryPassword = async (ctx: Context) => {
    const { email } = ctx.request.body;
    if (!email) {
      return ctx.badRequest("Email not found");
    }
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: email,
        },
        populate: true,
      });
    const userAdminPanelData = await strapi.query("admin::user").findOne({
      where: {
        email: email,
      },
    });

    if (!user || !userAdminPanelData) {
      return ctx.badRequest("User not found");
    }
    if (user.blocked) {
      return ctx.badRequest("User blocked");
    }
    if (!user.confirmed) {
      return ctx.badRequest("User not confirmed");
    }
    const resetPasswordToken = jwt.sign(
      { id: user.id, admin_user_id: userAdminPanelData.id },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const data = await strapi.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetPasswordToken,
      },
    });

    if (!data) {
      throw new ApplicationError("User not updated");
    }

    //  send email to the user
    const sendEmail = await sendUrlToRecoveryPasswordEmail(strapi, {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      resetPasswordToken: resetPasswordToken,
    });
    // if(!sendEmail){
    //   return ctx.badRequest("Email not sent")
    // }
    return ctx.send({
      message: "link to recovery password is sent your on email",
      status: 200,
    });
  };

  // verify password before change it
  plugin.controllers.user.verifyPasswordBeforeChange = async (ctx: Context) => {
    const { id, email, password } = ctx.request.body;
    if (!email) {
      return ctx.badRequest("Email not found");
    }
    if (!password) {
      return ctx.badRequest("Password required");
    }
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email: email }],
        },
        populate: true,
      });

    if (!user) {
      throw new ValidationError("Invalid identifier or password");
    }
    const userAdminPanelData = await strapi.query("admin::user").findOne({
      where: {
        email: user.email,
      },
    });
    if (!userAdminPanelData) {
      throw new ValidationError("user admin panel not found");
    }

    if (!user.password) {
      throw new ValidationError("Invalid identifier or password");
    }

    const validPassword = await getService("user").validatePassword(
      password,
      user.password
    );

    if (!validPassword) {
      throw new ValidationError("Invalid password");
    }
    const resetPasswordToken = jwt.sign(
      { id: user.id, admin_user_id: userAdminPanelData.id },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const data = await strapi.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetPasswordToken,
      },
    });

    if (!data) {
      throw new ApplicationError("User not updated");
    }

    //  send email to the user
    const sendEmail = await sendUrlToChangePasswordEmail(strapi, {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      resetPasswordToken: resetPasswordToken,
    });
    if (!sendEmail) {
      return ctx.badRequest("Email not sent");
    }
    return ctx.send({ message: "Password updated successfully", status: 200 });
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/recovery-password",
    handler: "user.recoveryPassword",
    config: {
      auth: false,
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/verify-password",
    handler: "user.verifyPasswordBeforeChange",
    config: {
      auth: false,
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/init-password",
    handler: "auth.initPasswordAfterRegistration",
    config: {
      auth: false,
    },
  });

  plugin.controllers.user.find = async (ctx: Context) => {
    try {
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          populate: {
            role_admin: true,
            company_id: true,
          },
        });
      return ctx.send(user);
    } catch (error) {
      console.log(error);
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/auth/registration-check",
    handler: "auth.registrationCheck",
    config: {
      auth: false,
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/invitation-check",
    handler: "auth.invitationCheck",
    config: {
      auth: false
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/invitation-accept",
    handler: "auth.acceptInvitation",
    config: {
      auth: { scope: [] },
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/users/me/tokens/summary",
    handler: "user.tokensSummary",
    config: {
      auth: { scope: [] },
      policies: [],
    },
  });

  plugin.controllers.user.tokensSummary = async (ctx: Context) => {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in.");
    }
    return "ok";

    // const summary = await strapi.service('api::token.token').summaryForUser(user.id);

    // ctx.body = { summary };
  };

  return plugin;
};
