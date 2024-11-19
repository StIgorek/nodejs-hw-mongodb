import ContactCollection from "../db/models/Contact.js";
import { calcPaginationData } from "../utils/calcPaginationData.js";

export const getContacts = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filter = {} }) => {
  const skip = (page - 1) * perPage;
  const query = ContactCollection.find();
  if (filter.userId) {
    query.where("userId").equals(filter.userId);
  };

  if (filter.isFavourite) {
    query.where("isFavourite").equals(filter.isFavourite);
  }
  if (filter.type) {
    query.where("contactType").equals(filter.type);
  };

  const [totalItems, data] = await Promise.all([
    ContactCollection.find().merge(query).countDocuments(),
    query.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }).exec(),
  ]);

  const paginationData = calcPaginationData({ totalItems, page, perPage });
  return {
    data,
    ...paginationData,
  };
};

export const getContactById = id => ContactCollection.findById(id);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted)
  };

};

export const deleteContact = async filter => ContactCollection.findOneAndDelete(filter);
