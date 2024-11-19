import createHttpError from "http-errors";
import { findSession, findUser } from "../services/auth.js";
//import { accessTokenLifetime } from "../constants/users.js";

export const authenticate = async (req, res, next) => {
  //const {authorization} = req.headers;
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(createHttpError(401, "Authorization header missing!"));
  };
  const [bearer, token] = authHeader.split(" "); //повертає масив, з якого ми берем 0 і 1 елемент
  if (bearer !== "Bearer") {
    return next(createHttpError(401, "Authorization header must be type Bearer"));
  };

  const session = await findSession({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, "Session not found!"));
  };
  if (Date.now > session.accessTokenLifetime) {
    return next(createHttpError(401, "Access Token expired!"));
  };

  const user = await findUser({ _id: session.userId });
  if (!user) {
    return next(createHttpError(401, "User not found!"));
  };

  req.user = user;

  next();
};