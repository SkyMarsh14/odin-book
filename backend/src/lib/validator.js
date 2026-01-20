import prisma from "./prisma.js";
import { body } from "express-validator";
const createUserValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 4, max: 30 })
    .withMessage("Username must be between 4 to 30 characters.")
    .custom(async (username) => {
      const user = await prisma.user.findFirst({
        where: {
          name: username,
        },
      });
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 3, max: 40 })
    .withMessage("Password must be within the length of 3 to 40 characters."),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];
const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 4, max: 30 })
    .withMessage("Username is be between 4 to 30 characters.")
    .custom(async (username) => {
      const user = await prisma.user.findFirst({
        where: {
          name: username,
        },
      });
      if (!user) throw new Error("Either a password or username is incorrect.");
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 3, max: 40 })
    .withMessage("Password is within the length of 3 to 40 characters."),
];
export { createUserValidation, loginValidation };
