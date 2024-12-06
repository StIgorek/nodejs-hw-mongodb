import * as path from "node:path";

//path.resolve() - абсолютний шлях до папки

export const TEMPLATE_DIR = path.resolve("src", "templates");

export const TEMP_UPLOAD_DIR = path.resolve("temp");

export const UPLOADS_DIR = path.resolve("uploads");

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');