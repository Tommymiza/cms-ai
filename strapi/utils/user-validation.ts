"use strict";
import { validateYupSchema, yup } from "@strapi/utils";

const createUserBodySchema = yup.object().shape({
  email: yup.string().email().required(),
  // username: yup.string().min(1).required(),
  // password: yup.string().min(1).required(),
  // role: yup.lazy((value) =>
  //   typeof value === 'object'
  //     ? yup
  //         .object()
  //         .shape({
  //           connect: yup
  //             .array()
  //             .of(yup.object().shape({ id: yup.strapiID().required() }))
  //             .min(1, 'Users must have a role')
  //             .required(),
  //         })
  //         .required()
  //     : yup.strapiID().required()
  // ),
});

const callbackSchema = yup.object({
  identifier: yup.string().required(),
  password: yup.string().required(),
});
export const validateCreateUserBody = validateYupSchema(createUserBodySchema);
export const validateCallbackBody = validateYupSchema(callbackSchema);
