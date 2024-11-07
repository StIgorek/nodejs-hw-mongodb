import { Router } from "express";
import {
  getContactsController,
  getContactByIdController,
  addContactController,
  patchContactController,
  deleteContactController
} from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { createContactSchema, patchContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";


const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post("/", validateBody(createContactSchema), ctrlWrapper(addContactController));

contactsRouter.patch("/:id", isValidId, validateBody(patchContactSchema), ctrlWrapper(patchContactController));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;