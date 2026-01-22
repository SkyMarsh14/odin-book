import prisma from "../lib/prisma.js";
import validator from "../lib/validator.js";
const postController = {
  create: [
    validator.postValidation,
    async (req, res, next) => {
      try {
        const { content } = req.body;
        const post = await prisma.post.create({
          data: {
            authorId: req.user.id,
            content: content,
          },
        });
        return res.json(post);
      } catch (err) {
        next(err);
      }
    },
  ],
};
export default postController;
