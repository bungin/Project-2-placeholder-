import type { Request, Response } from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";

// GET /users - Get all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude password in response
    });
    console.log("Fetched all users successfully");
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /users/:id - Get a user by id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Exclude password in response
    });
    if (user) {
      console.log(`Fetched user with ID: ${id}`);
      res.json(user);
    } else {
      console.log(`User not found with ID: ${id}`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /users - Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Corrected validation check for required fields
  if (!username || !email || !password) {
    console.log(
      "Validation failed: Username, email, and password are required"
    );
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    // Log the user creation request for debugging
    console.log("Creating user with:", { username, email, password });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Log the created user for debugging (excluding password)
    console.log("New user created successfully:", {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    // Return the created user without the password field
    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Error during user creation:", error);
    return res.status(400).json({ message: error.message });
  }
};

// PUT /users/:id - Update a user by id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password } = req.body;

  // Log the request details for debugging
  console.log(`Update request received for user ID: ${id}`, {
    username,
    password,
  });

  try {
    const user = await User.findByPk(id);
    if (user) {
      // Update username
      user.username = username;

      // If a new password is provided, hash and update it
      if (password) {
        console.log("Hashing the new password...");
        user.password = await bcrypt.hash(password, 10);
      }

      // Save the updated user details
      await user.save();

      console.log(`User updated successfully: ${username}`);
      res.json({ message: "User updated successfully", user });
    } else {
      console.log(`User not found with ID: ${id}`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE /users/:id - Delete a user by id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Log the request details for debugging
  console.log(`Delete request received for user ID: ${id}`);

  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      console.log(`User deleted successfully with ID: ${id}`);
      res.json({ message: "User deleted successfully" });
    } else {
      console.log(`User not found with ID: ${id}`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};
