import { validationResult } from "express-validator";
import { createUserValidation, loginValidation } from "../lib/validator.js";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const authController = {
  createUser: [
    createUserValidation,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            name: username,
            password: hashedPassword,
          },
        });
        delete user.password;
        return res.json(user);
      } catch (err) {
        throw new Error(err);
      }
    },
  ],
  login: [
    loginValidation,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
          where: {
            name: username,
            password,
          },
        });
        if (!user)
          return res
            .status(401)
            .json([{ msg: "User with the given credentails not found." }]);
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (!match)
            return res.status(401).json([{ msg: "Incorrect credentials" }]);
        }
        const token = jwt.sign(
          {
            id: user.id,
            name: username,
            email: user.email,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" },
        );
        return res.json({ token, user });
      } catch (err) {
        next(err);
      }
    },
  ],
  guestLogin: async (req, res, next) => {
    try {
      const { id, name } = await prisma.user.findUnique({
        where: {
          username: "Guest",
        },
      });
      delete user.password;
      const token = jwt.sign(
        {
          id,
          name,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      return res.json({ token, user });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
