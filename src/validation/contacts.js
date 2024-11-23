import Joi from "joi";
import { contactTypeList } from "../constants/contacts.js";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "any.required": `Поле Ім'я обов'язкове`
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    "any.required": `Поле Номер телефону обов'язкове`
  }),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean().valid(false, true),
  contactType: Joi.string().valid(...contactTypeList).min(3).max(20),
});

export const patchContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean().valid(false, true),
  contactType: Joi.string().valid(...contactTypeList).min(3).max(20),
});