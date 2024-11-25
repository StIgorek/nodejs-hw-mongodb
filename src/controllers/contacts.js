import mongoose from "mongoose";
import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { sortByList } from "../db/models/Contact.js";
import { parseContactsFilterParams } from "../utils/parseContactsFilterParams.js";


export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseContactsFilterParams(req.query);
  const { _id: userId } = req.user;
  filter.userId = userId;


  const data = await contactServices.getContacts({ page, perPage, sortBy, sortOrder, filter });

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const data = await contactServices.getContactById(id, userId);

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
  const { _id: userId } = req.user;
  const data = await contactServices.addContact({ ...req.body, userId });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await contactServices.updateContact({ _id, payload: req.body, userId });

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
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await contactServices.deleteContact(_id, userId);

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  };

  res.status(204).send();
};