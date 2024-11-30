import mongoose from "mongoose";
import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";
import * as path from "node:path";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { sortByList } from "../db/models/Contact.js";
import { parseContactsFilterParams } from "../utils/parseContactsFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";

const enableCloudinary = env("ENABLE_CLOUDINARY");

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
  let photo = null;
  if (req.file) {
    if (enableCloudinary === "true") {
      photo = await saveFileToCloudinary(req.file, "photo");
    }
    else {
      await saveFileToUploadDir(req.file);
      photo = path.join(req.file.filename);
    }
  };

  const data = await contactServices.addContact({ ...req.body, photo, userId });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req.user._id;
  let photo = null;
  if (req.file) {
    if (enableCloudinary === "true") {
      photo = await saveFileToCloudinary(req.file, "photo");
    }
    else {
      await saveFileToUploadDir(req.file);
      photo = path.join(req.file.filename);
    }
  };

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await contactServices.updateContact({ _id, payload: { ...req.body, photo }, userId });

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