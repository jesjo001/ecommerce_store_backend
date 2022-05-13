import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { USER_TYPE } from "../utils/Constants";

export interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  address: string;
  city: string;
  country: string;
  role: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePasswords: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: USER_TYPE,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  //only hash the password if it has been modified or new
  if (!user.isModified("password")) return next();

  //get salt
  const salt = await bcrypt.genSalt(parseInt(process.env.saltWorkFactor as any));
  // const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

//Used for logging in users
userSchema.methods.comparePassword = async function (
  candidatePasswords: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePasswords, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
