import { validationResult } from "express-validator";
import validator from "../lib/validator.js";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import createUser from "../lib/createUser.js";

const authController = {
  createUser: [
    validator.createUser,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const userData = await createUser(username, password);
        const user = await prisma.user.create({
          data: userData,
        });
        return res.json(user);
      } catch (err) {
        throw new Error(err);
      }
    },
  ],
  login: [
    validator.login,
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
          },
          omit: {
            password: false,
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
        delete user.password;
        const token = jwt.sign(
          {
            id: user.id,
            name: username,
            email: user.email,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "10h" },
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
