import prisma from "../lib/prisma.js";
const userController = {
  follow: async (req, res, next) => {
    try {
      const requestingUser = Number(req.user.id);
      const requestedUser = Number(req.params.userId);
      const followingUser = await prisma.user.update({
        where: {
          id: requestingUser,
        },
        data: {
          following: {
            connect: {
              id: requestedUser,
            },
          },
        },
      });
      const followedUser = await prisma.user.update({
        where: {
          id: requestedUser,
        },
        data: {
          followedBy: {
            connect: {
              id: requestingUser,
            },
          },
        },
      });
      return res.json({ followingUser, followedUser });
    } catch (err) {
      next(err);
    }
  },
  getUserInfo: async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.user.id,
      },
      include: {
        _count: {
          select: {
            followedBy: true,
            following: true,
          },
        },
      },
    });
    return res.json(user);
  },
};

export default userController;
