import prisma from "../lib/prisma.js";
import profileImgUploader from "../lib/profileImgUploader.js";

const userController = {
  follow: async (req, res) => {
    const requestingUserId = Number(req.user.id);
    const requestedUserId = Number(req.params.userId);

    if (requestedUserId === requestingUserId) {
      throw new Error(
        "You cannot follow yourself. User following cannot be the same as user being followed.",
      );
    }

    const alreadyFollows = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followingId: requestedUserId,
          followerId: requestingUserId,
        },
      },
    });

    if (alreadyFollows) {
      throw new Error("You already follow this user.");
    }

    const follow = await prisma.follows.create({
      data: {
        followingId: requestedUserId,
        followerId: requestingUserId,
      },
    });
    return res.json({
      follow,
      msg: `Successfully followed user`,
    });
  },

  unfollow: async (req, res) => {
    const requestingUserId = Number(req.user.id);
    const requestedUserId = Number(req.params.userId);

    const match = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followingId: requestedUserId,
          followerId: requestingUserId,
        },
      },
    });

    if (!match) {
      throw new Error("You cannot unfollow a user that you do not follow");
    }

    const unfollow = await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followingId: requestedUserId,
          followerId: requestingUserId,
        },
      },
    });

    return res.json({
      unfollow,
      msg: `Successfully unfollowed the user`,
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
            followers: true,
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
    return res.json(file);
  },

  getFollowers: async (req, res) => {
    const userId = Number(req.params.userId);
    let followers = await prisma.follows.findMany({
      where: {
        followingId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            file: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
    if (!followers || followers.length === 0) {
      return res.json({
        msg: "The user does not have any followers",
        followers: [],
      });
    }
    return res.json(followers);
  },

  getFollowingUsers: async (req, res) => {
    const userId = Number(req.params.userId);
    const followingUsers = await prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            file: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
    if (!followingUsers || followingUsers.length === 0) {
      return res.json({
        msg: "The user does not follow anyone",
        following: [],
      });
    }

    return res.json(followingUsers);
  },
};

export default userController;
