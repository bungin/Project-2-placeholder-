import { type Request, type Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log('loging called');
  const user = await User.findOne({
    where: { username },
  });
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  console.log(user.password);
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const secretKey = process.env.JWT_SECRET_KEY || '';

  const token = jwt.sign({ id: user.id, username }, secretKey, { expiresIn: '1d' });
  return res.json({ token });
};

export const signup = async (req: Request, res: Response) => {
  console.log("Request received at signup endpoint.")
  console.log("Received signup request:", req.body);
  const { username, email, password } = req.body;

  try {
    // Remove uniqueness checks since your project does not require unique constraints
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("User created successfully:", newUser);

    const secretKey = process.env.JWT_SECRET_KEY || '';
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, secretKey, { expiresIn: '1d' });

    return res.status(201).json({ message: 'User created successfully!', token });
  } catch (err) {
    console.error('Error during signup:', err);
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
