import { Core } from "@strapi/strapi";
import { env } from "process";

export async function sendConfirmationEmail(strapi: Core.Strapi, user: any) {
  const baseUrl = env.COLIBRI_ADMIN_URL || "http://localhost:3000";
  const { firstname, lastname, email, registrationToken } = user;
  console.log("sdenddd")
  if (!registrationToken || !firstname || !lastname || !email) {
    strapi.log.info("missing credentials send email");
    return;
  }
  const welcomeEmailTemplate = `
            <!DOCTYPE html>
            <html>
            <head> 
              <title>Welcome to Our Platform</title>
            </head>
            <body>
              <h1>Hello ${firstname} ${lastname}!</h1>
              <p>Welcome to our platform! We're glad to have you.</p>
               <a href="${baseUrl}/set-password?token=${registrationToken}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Activate Account</a>
                <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
                
              <p>Best regards,</p>
              <p>The Team</p>

              <div style="margin-top: 30px; font-size: 0.8em; color: #7f8c8d;">
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>
          `;

  try {
    await strapi.plugins["email"].services.email.send({
      to: email,
      subject: `Welcome ${firstname} to Tweeksy Admin Panel`,
      html: welcomeEmailTemplate,
    });
  } catch (err) {
    console.log(err);
    console.log(err.body);
  }
}

export async function sendUrlToChangePasswordEmail(strapi: Core.Strapi, user: any) {
  const baseUrl = env.COLIBRI_ADMIN_URL || "http://localhost:3000";
  const { firstname, lastname, email, resetPasswordToken } = user;
  if (!resetPasswordToken || !firstname || !lastname || !email) {
    strapi.log.info("missing credentials send email");
    return;
  }
  const welcomeEmailTemplate = `
            <!DOCTYPE html>
            <html>
            <head> 
              <title>Change password</title>
            </head>
            <body>
              <h1>Hello ${firstname} ${lastname}!</h1>
              <p>Click the button bellow to change your password</p>
               <a href="${baseUrl}/set-password?token=${resetPasswordToken}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Change your password</a>
                <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
                
              <p>Best regards,</p>
              <p>The Team</p>

              <div style="margin-top: 30px; font-size: 0.8em; color: #7f8c8d;">
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>
          `;

  try {
    const send = await strapi.plugins["email"].services.email.send({
      to: email,
      subject: `Change your password on Tweeksy Admin Panel`,
      html: welcomeEmailTemplate,
    });
    if (send) {
      return true
    }
  } catch (err) {
    console.log(err);
    console.log(err.body);
  }
}

export async function sendUrlToRecoveryPasswordEmail(strapi: Core.Strapi, user: any) {
  const baseUrl = env.COLIBRI_ADMIN_URL || "http://localhost:3000";
  const { firstname, lastname, email, resetPasswordToken } = user;
  if (!resetPasswordToken || !firstname || !lastname || !email) {
    strapi.log.info("missing credentials send email");
    return;
  }
  const recoveryEmailTemplate = `
            <!DOCTYPE html>
            <html>
            <head> 
              <title>Recovery password</title>
            </head>
            <body>
              <h1>Hello ${firstname} ${lastname}!</h1>
              <p>Click the button bellow to recovery your password</p>
               <a href="${baseUrl}/set-password?token=${resetPasswordToken}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Change your password</a>
                <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
                
              <p>Best regards,</p>
              <p>The Team</p>

              <div style="margin-top: 30px; font-size: 0.8em; color: #7f8c8d;">
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>
          `;

  try {
    const send = await strapi.plugins["email"].services.email.send({
      to: email,
      subject: `Recovery your password on Tweeksy Admin Panel`,
      html: recoveryEmailTemplate,
    });
    if (send) {
      return true
    }
  } catch (err) {
    console.log(err);
    console.log(err.body);
  }
}

export async function sendInvitationEmail(strapi: Core.Strapi, invitation: any) {
  const baseUrl = env.COLIBRI_ADMIN_URL || "http://localhost:3000";
  const { invitationToken, email, role } = invitation;
  const invitationTemplate = `
            <!DOCTYPE html>
            <html>
            <head> 
              <title>Invitation</title>
            </head>
            <body>
              <h1>Hello ${email}!</h1>
              <p>Click the button bellow to accept your invitation on Tenant with ${role} role</p>
               <a href="${baseUrl}/invitation?token=${invitationToken}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Accept invitation</a>
                <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
                
              <p>Best regards,</p>
              <p>The Team</p>

              <div style="margin-top: 30px; font-size: 0.8em; color: #7f8c8d;">
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>dwd
          `;

  try {
    const send = await strapi.plugins["email"].services.email.send({
      to: email,
      subject: `Invitation to join tenant`,
      html: invitationTemplate,
    });
    if (send) {
      return true
    }
  } catch (err) {
    console.log(err);
    console.log(err.body);
  }
}