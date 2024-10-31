import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
//import { logger } from "../src/middlewares/logger.js";
import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "../src/middlewares/notFoundHandler.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";


export const startServer = () => {
  const app = express();
  app.use(cors());

  //app.use(logger);


  app.use("/contacts", contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);


  const port = Number(env("PORT", 3000));
  app.listen(port, () => console.log(`Server running on ${port} PORT`));
};