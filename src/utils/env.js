import dotenv from "dotenv";
dotenv.config();
//import "dotenv/config"; (альтернативний імпорт та виклик функції)



export const env = (name, defaultValue) => {
  const value = process.env[name];
  if (value) return value;
  if (defaultValue) return defaultValue;
  throw new Error(`Missing process.env[${name}]`);
};
