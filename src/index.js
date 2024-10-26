import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "../src/server.js";


const boostrap = async () => {
  await initMongoDB();
  startServer();
};

boostrap();