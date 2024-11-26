import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "../src/server.js";
import { createDirIfNotExist } from "../src/utils/createDirIfNotExist.js";
import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from "./constants/index.js";


const boostrap = async () => {
  await initMongoDB();
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
  startServer();
};

boostrap();