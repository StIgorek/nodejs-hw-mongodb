import { contactTypeList } from "../constants/contacts.js";

//const parseQueryParams = (queryParams) => {
//  const isString = typeof type === "string";
//  if (!isString) return;
//  const isFavourite = (queryParams) => 
//  return parseQueryParams;
//  };

const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return number;

  return parsedNumber;
};


const parseType = (type) => {
  const isString = typeof type === "string";
  if (!isString) return;
  const isType = (type) => contactTypeList.includes(type);

  if (isType(type)) return type;
};


export const parseContactsFilterParams = ({ isFavourite, type }) => {
  const parsedIsFavourite = parseNumber(isFavourite);
  const parsedType = parseType(type);
  return {
    isFavourite: parsedIsFavourite,
    type: parsedType,
  };
};