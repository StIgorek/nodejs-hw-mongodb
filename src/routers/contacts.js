import { Router } from "express";
import * as contactServices from "../services/contacts.js";

const contactsRouter = Router();

contactsRouter.get("/contacts", async (req, res) => {
  const data = await contactServices.getContacts();
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
});

contactsRouter.get("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);

  if (!data) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id=${id} not found`,
    });
  }
  res.json({
    status: 200,
    message: "Successfully found contact with id {contactId}!",
    data,
  });
});

export default contactsRouter;