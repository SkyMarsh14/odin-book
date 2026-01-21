import prisma from "../lib/prisma.js";
import { postValidation } from "../lib/validator.js";
const postController = {
  create: [
    postValidation,
    async (req, res, next) => {
      try {
        const { content } = req.body;
      } catch (err) {
        next(err);
      }
    },
  ],
};
export default postController;
