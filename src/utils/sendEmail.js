import nodemailer from "nodemailer";
//import dotenv from "dotenv";
//dotenv.config();
import { env } from '../utils/env.js';


const transport = nodemailer.createTransport({
  host: env("SMTP_HOST"),
  port: Number(env("SMTP_PORT")),
  auth: {
    user: env("SMTP_USER"),
    pass: env("SMTP_PASSWORD"),
  },
});

export const sendEmail = async options => {
  return await transport.sendMail(options);
};

