import { validationResult } from "express-validator";
import validator from "../lib/validator.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import createUser from "../lib/createUser.js";
import profileImgUploader from "../lib/profileImgUploader.js";

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
  login: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        file: true,
      },
    });
    return res.json({ user, msg: "Login successfull" });
  },
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
