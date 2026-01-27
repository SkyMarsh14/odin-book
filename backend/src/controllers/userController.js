import prisma from "../lib/prisma.js";
import profileImgUploader from "../lib/profileImgUploader.js";
const userController = {
  follow: async (req, res) => {
    const requestingUserId = Number(req.user.id);
    const requestedUserId = Number(req.params.userId);
    if (requestedUserId === requestedUserId) {
      throw new Error(
        "You cannot follow yourself. User following cannot be the same as user being followed.",
      );
    }
    const followingUser = await prisma.user.update({
      where: {
        id: requestingUserId,
      },
      data: {
        following: {
          connect: {
            id: requestedUserId,
          },
        },
      },
    });
    const followedUser = await prisma.user.update({
      where: {
        id: requestedUserId,
      },
      data: {
        followedBy: {
          connect: {
            id: requestingUserId,
          },
        },
      },
    });
    return res.json({
      followingUser,
      followedUser,
      msg: `Successfully Followed ${followedUser.name}`,
    });
  },
  unfollow: async (req, res) => {
    const requestingUserId = Number(req.user.id);
    const requestedUserId = Number(req.params.userId);
    const unfollowingUser = await prisma.user.update({
      where: {
        id: requestingUserId,
      },
      data: {
        following: {
          disconnect: {
            id: requestedUserId,
          },
        },
      },
    });
    const unfollowedUser = await prisma.user.update({
      where: {
        id: requestedUserId,
      },
      data: {
        followedBy: {
          disconnect: {
            id: requestingUserId,
          },
        },
      },
    });
    return res.json({
      unfollowingUser,
      unfollowedUser,
      msg: `Successfully Unfollwed ${unfollowedUser.name}`,
    });
  },
  getUserInfo: async (req, res) => {
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
  changeProfile: async (req, res) => {
    if (!req.file) {
      throw new Error("File is required for this route.");
    }
    const file = await profileImgUploader.replace(req, req.user.id);
    return res.josn(file);
  },
  getFollowers: async (req, res) => {
    const userId = Number(req.params.userId);
    const followers = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followedBy: {
          include: {
            file: true,
          },
        },
      },
    });
    return res.json(followers);
  },
  getFollowingUsers: async (req, res) => {
    const userId = Number(req.params.userId);
    const followingUsers = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        following: {
          include: {
            file: true,
          },
        },
      },
    });
    return res.json(followingUsers);
  },
};

export default userController;
