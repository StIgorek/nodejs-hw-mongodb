import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { contactTypeList } from "../../constants/contacts.js";


const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  isFavourite: {
    type: Boolean,
    default: false,
    required: true,
  },
  contactType: {
    type: String,
    enum: contactTypeList,
    required: true,
    default: "personal",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
}, { timestamps: true, versionKey: false, },
);
contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const sortByList = ["name"];

const ContactCollection = model("contact", contactSchema);
export default ContactCollection;