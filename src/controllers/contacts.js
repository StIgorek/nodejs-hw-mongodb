import * as contactServices from "../services/contacts.js";
//import mongoose from "mongoose";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";


export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const data = await contactServices.getContacts({ page, perPage });
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const data = await contactServices.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
    //const error = new Error(`Contact with id=${id} not found`);
    //error.status = 404;
    //throw error;
  };

  res.json({
    status: 200,
    message: `Successfully found contact with id=${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {

  const data = await contactServices.addContact(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await contactServices.updateContact({ _id, payload: req.body });

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  };

  res.json(
    {
      status: 200,
      message: "Successfully patched a contact!",
      data: result.data,
    }
  );
};

export const deleteContactController = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await contactServices.deleteContact({ _id });

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  };

  res.status(204).send();
};