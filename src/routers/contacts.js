import { Router } from "express";
import { getContactsController, getContactByIdController } from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";


const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:id", ctrlWrapper(getContactByIdController));

export default contactsRouter;