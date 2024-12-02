import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../../constants/users.js";

export const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  //verify: {
  //  type: Boolean,
  //  default: false,
  //  required: true
  //}
}, { timestamps: true, versionKey: false, },);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserCollection = model("user", userSchema);

export default UserCollection;
