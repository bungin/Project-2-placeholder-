import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/usersController.js";

const router = express.Router();

// GET /api/users - Get all users
router.get("/", getUsers);

// GET /api/users/:id - Get a user by id
router.get("/:id", getUserById);

// POST /api/users - Create a new user
router.post("/", createUser);

// PUT /api/users/:id - Update a user by id
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete a user by id
router.delete("/:id", deleteUser);

export { router as usersRouter };
