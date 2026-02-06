import { validationResult } from "express-validator";
import validator from "../lib/validator.js";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import createUser from "../lib/createUser.js";
import profileImgUploader from "../lib/profileImgUploader.js";
import cookieConfig from "../config/cookie.js";

const authController = {
  createUser: [
    validator.createUser,
    async (req, res, next) => {
      try {
        let profile;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const userData = await createUser(username, password);
        const user = await prisma.user.create({
          data: userData,
        });
        if (req?.file) {
          profile = await profileImgUploader.create(req, user.id);
        }
        return res.json({ profile, user });
      } catch (err) {
        next(err);
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
          { expiresIn: "2d" },
        );
        res.cookie("token", token, {
          cookieConfig,
        });
        return res.json(user);
      } catch (err) {
        next(err);
      }
    },
  ],
  guestLogin: async (req, res) => {
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
  },
  githubLogin: async (req, res) => {
    const { code } = req.query;
    const exchangeUrl = new URL(
      "login/oauth/access_token",
      "https://github.com",
    );
    exchangeUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
    exchangeUrl.searchParams.set(
      "client_secret",
      process.env.GITHUB_CLIENT_SECRET,
    );
    exchangeUrl.searchParams.set("code", code);
    const tokenResponse = await fetch(exchangeUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    const tokenData = await tokenResponse.json();
    if (!tokenData?.access_token) {
      if (tokenData?.error) {
        throw new Error(tokenData?.error);
      } else {
        throw new Error(
          `External server error. Failed to fetch token data from Github server`,
        );
      }
    }
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });
    const userData = await userResponse.json();
  },
};

export default authController;
