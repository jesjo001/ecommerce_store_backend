import { DocumentDefinition, FilterQuery } from "mongoose";
import User, { UserDocument } from "../../model/user.model";
import { omit } from "lodash";

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
  return await User.create(input);
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const validateWithUsername = async ({
  username,
  password,
}: {
  username: UserDocument["username"];
  password: string;
}) => {
  const user = await User.findOne({ username });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const findUser = async (query: FilterQuery<UserDocument>) => {
  return await User.findOne(query).lean();
};
