import Joi from "joi";
import { emailRegexp } from "../constants/users";

//signup
export const authRegisterSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  passward: Joi.string().min(6).required(),
});

//sigin
export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  passward: Joi.string().min(6).required(),
});