import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  updateUser,
} from "../services/userService";

//@desc Get all Users
//@route GET /api/users
//@access Public
export const getAllusersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await getUsers();
    res.status(200).json(users);
  }
);

//@desc Create a new User
//@route POST /api/users
//@access Private
export const createUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await createUser(req.body);
    res.status(201).json(user);
  }
);

//@desc Login a User
//@route POST /api/users/login
//@access Private

export const loginUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await loginUser(req.body.email, req.body.password);
  res.status(200).json(user)
})

//@desc Get a User by id
//@route GET /api/users/:id
//@access Public
export const getUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  }
);

//@desc Delete a User by id
//@route DELETE /api/user/:id
//@access Private
export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await deleteUser(req.params.id);
    res.status(200).json({
      message: `user ${req.params.id} deleted`,
      user: user,
    });
  }
);

//@desc Update a User by id
//@route PUT /api/user/:id
//@access private
export const updateUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await updateUser(req.params.id, req.body);
    res.json({
      message: `user ${req.params.id} updated`,
      user: user,
    });
  }
);
