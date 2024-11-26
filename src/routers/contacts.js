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
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getContactByIdController));

//upload.array("photo", 10)
//upload.fields([{name: "photo", maxCount: 1}, {name: "subphotos", maxCount: 3}])
contactsRouter.post("/", upload.single("photo"), validateBody(createContactSchema), ctrlWrapper(addContactController));

contactsRouter.patch("/:id", isValidId, validateBody(patchContactSchema), ctrlWrapper(patchContactController));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;