import { type Request, type Response } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Log the incoming login request
  console.log("Login request received");

  try {
    // Find the user by username in the database
    console.log(`Searching for user with username: ${username}`);
    const user = await User.findOne({ where: { username } });

    // If user is not found, log it and return 401 Unauthorized
    if (!user) {
      console.log(`Username or Password is incorrect`);
      return res
        .status(401)
        .json({ message: "Authentication failed" });
    }

    // Compare the provided password with the stored hash
    const passwordIsValid = await bcrypt.compare(password, user.password);
    console.log(
      `Username or Password is incorrect`
    );

    // If password comparison fails, log it and return 401 Unauthorized
    if (!passwordIsValid) {
      console.log(`Username or Password is incorrect`);
      return res
        .status(401)
        .json({ message: "Authentication failed" });
    }

    // If authentication is successful, generate a JWT token
    const secretKey = process.env.JWT_SECRET_KEY || "";
    const token = jwt.sign({ id: user.id, username }, secretKey, {
      expiresIn: "1d",
    });

    // Log successful authentication
    console.log(`User authenticated successfully: ${username}`);
    return res.json({ token });
  } catch (error) {
    console.error("Error during login process:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Signup Function
export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Log the incoming request data
  console.log("Signup request received with:", { username, email });

  try {
    // Check if username or email already exists
    // Check currently doesn't work
    const existingUser =
      (await User.findOne({ where: { username } })) ||
      (await User.findOne({ where: { email } }));
    if (existingUser) {
      console.log(
        `User with username or email already exists: ${username}, ${email}`
      );
      return res
        .status(400)
        .json({ message: "User with this username or email already exists" });
    }

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: password,
    });
    console.log(`New user created: ${newUser.username}`);

    // Generate a JWT token
    const secretKey = process.env.JWT_SECRET_KEY || "";
    const token = jwt.sign({ id: newUser.id, username }, secretKey, {
      expiresIn: "1d",
    });

    // Log successful signup
    console.log("Returning token for newly created user");
    return res.status(201).json({ token });
  } catch (error) {
    console.error("Error during signup process:", error);
    return res.status(500).json({ message: "Failed to create user", error });
  }
};
