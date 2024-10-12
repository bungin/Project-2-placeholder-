import { User } from "../models/index.js";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  // Predefined users
  const users = [
    { username: "JollyGuru", 
      email: "jolly@guru.com", 
      password: "password" },
    {
      username: "SunnyScribe",
      email: "sunny@scribe.com",
      password: "password",
    },
    {
      username: "RadiantComet",
      email: "radiant@comet.com",
      password: "password",
    },
  ];

  // Hash the passwords
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10), // Hash the password before storing
    }))
  );

  // Bulk create with hashed passwords
  await User.bulkCreate(hashedUsers, { individualHooks: true });
  console.log("User seed data successfully created!");
};
