import UserCollection from "../db/models/User.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export const register = async payload => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, "Email in use");
  };

  // const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, 10);

  return UserCollection.create({ ...payload, password: hashPassword });
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Email invalid!");
  };
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, "Password invalid!");
  };
};