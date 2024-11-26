import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { SMTP_PASSWORD, SMTP_FROM } = process.env;

const nodemailerConfig = {
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: true,
  auth: {
    user: SMTP_FROM,
    pass: SMTP_PASSWORD
  }
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = data => {
  const email = { ...data, from: SMTP_FROM };
  return transport.sendMail(email);
};

