import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

export const userSchema = new Schema({
  iserId: {
    type: Schema.Types.ObjectId,
  },
},
  { timestamps: true, versionKey: false, },);