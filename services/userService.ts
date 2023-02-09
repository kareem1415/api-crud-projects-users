import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import { UserReturnType, UserType } from "../types/userTypes";
import { IUserSchema } from "../schema/userSchema";
import { checkIsValidObjectId } from "../database/db";
import { sanitizeLoginUser, sanitizeUser } from "../sanitizers/userSanitizer";
import HttpException from '../utils/httpException';
import { generateToken } from './tokenService';

export async function getUsers(): Promise<UserType[]> {
  try {
    const users = await UserModel.find();
    if (!users) throw new HttpException("No users found!", 404);
    return users;
  } catch (err) {
    throw new HttpException("users not found!", 400);
  }
}

export async function createUser(user: UserType): Promise<UserReturnType> {
  const sanitizedUser = await sanitizeUser(user);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(sanitizedUser.password, salt);
  try {
    const newUser = await UserModel.create({
      username: sanitizedUser.username,
      email: sanitizedUser.email,
      password: hashedPassword,
      isAdmin: sanitizedUser.isAdmin,
    });

    if (!newUser) throw new HttpException("user not created", 404);

    return {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }),
    }
  } catch (err) {
    throw new HttpException(`failed to create user ${err.message}`, 400);
  }
}

export async function getUserById(userId: string): Promise<IUserSchema> {
  checkIsValidObjectId(userId);
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new HttpException("user not found", 404);
    return user;
  } catch (err) {
    throw new HttpException("Error finding user", 400);
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserReturnType> {
  const sanitizedUser = await sanitizeLoginUser(email, password);
  try {
    const user = await UserModel.findOne({ email });
    if (!user) throw new HttpException("User not found", 401);

    const isPasswordValid = await bcrypt.compare(
      sanitizedUser.password,
      user.password
    );
    if (!isPasswordValid) throw new HttpException("Password is invalid", 401);

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }),
    }
  } catch (err) {
    throw new HttpException(`Failed to login user: ${err.message}`, 401);
  }
}

export async function updateUser(
  userId: string,
  user: UserType
): Promise<void> {
  checkIsValidObjectId(userId);
  const sanitizedUser = sanitizeUser(user);
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      sanitizedUser,
      { new: true }
    );
    if (!updatedUser) throw new HttpException("User not found", 404);

    return;
  } catch (err) {
    throw new HttpException(`failed to update user ${err.message}`, 400);
  }
}

export async function deleteUser(userId: string): Promise<IUserSchema> {
  checkIsValidObjectId(userId);
  try {
    const deleteUser = await UserModel.findByIdAndDelete(userId);
    if (!deleteUser) throw new Error("Error Deleting user");
    return deleteUser;
  } catch (err) {
    throw new HttpException(`failed to delete user ${err.message}`, 400);
  }
}
