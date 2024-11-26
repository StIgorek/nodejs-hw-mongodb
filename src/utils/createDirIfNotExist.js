import * as fs from "node:fs/promises";

export const createDirIfNotExist = async path => {
  try {
    await fs.access(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      fs.mkdir(path);
    }
  };
};