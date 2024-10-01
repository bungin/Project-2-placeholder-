import { type Request, type Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Login Function
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const secretKey = process.env.JWT_SECRET_KEY || '';
    const token = jwt.sign({ id: user.id, username }, secretKey, { expiresIn: '1d' });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// Signup Function
export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ where: { username } }) || await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const token = jwt.sign({ id: newUser.id, username }, secretKey, { expiresIn: '1d' });

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user', error });
  }
};
