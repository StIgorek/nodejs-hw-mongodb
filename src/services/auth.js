import UserCollection from "../db/models/User.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { TEMPLATE_DIR } from "../constants/index.js";
import { randomBytes } from "crypto";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";
import { sendEmail } from "../utils/sendEmail.js";
import { env } from "../utils/env.js";
import handlebars from "handlebars";
import jwt from "jsonwebtoken";

const emailTemplatePath = path.join(TEMPLATE_DIR, "verify-email.html");
const appDomain = env("APP_DOMAIN");
const jwtSecret = env("JWT_SECRET"); //https://randomkeygen.com/ 256-bit

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime
  };
};

export const register = async payload => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, "Email in use");
  };
  // const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({ ...payload, password: hashPassword });

  //const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
  //const template = Handlebars.compile(templateSource);
  //const token = jwt.sign({ email }, jwtSecret, { expiresIn: "24h" });
  //const html = template({ link: `${appDomain}/auth/verify?token=${token}` });

  //const verifyEmail = {
  //  to: email,
  //  subject: "Verify your email",
  //  html
  //};
  //await sendEmail(verifyEmail);
  return newUser;
};

export const verify = async token => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = findUser({ email });
    if (!user) {
      throw createHttpError(404, `${email} not found`);
    }
    return await UserCollection.findByIdAndUpdate(user._id, { verify: true });
  }
  catch (error) {
    throw createHttpError(401, error.message);
  };
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) { throw createHttpError(401, "Email invalid!"); };
  //if (!user.verify) { throw createHttpError(401, "Email not verified!"); };

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) { throw createHttpError(401, "Password invalid!"); };

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...newSession
  });

};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, "Session not found!");
  };
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, "Refresh token expired!");
  };

  await SessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession
  });

};

export const logout = sessionId => SessionCollection.deleteOne({ _id: sessionId });

export const findSession = filter => SessionCollection.findOne(filter);

export const findUser = filter => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  };

  const resetToken = jwt.sign({ sub: user._id, email }, jwtSecret, { expiresIn: "5m" });

  const templateSource = (
    await fs.readFile(emailTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const resetLink = `${appDomain}/reset-password?token=${resetToken}`;

  const html = template({
    name: user.name,
    link: resetLink,
  });

  await sendEmail({
    from: env("SMTP_FROM"),
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      throw createHttpError(401, "Token is expired or invalid!");
    }
    throw error;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await SessionCollection.deleteOne({ userId: user.id });

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};