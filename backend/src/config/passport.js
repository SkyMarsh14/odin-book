import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import prisma from "../lib/prisma.js";
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            id: +profile.id,
          },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: +profile.id,
              name: profile.username,
              githubAvatarUrl: profile.photos[0].value,
            },
          });
        }
        if (user) {
          user.accessToken = accessToken;
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);
passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          name: username,
        },
        omit: {
          password: false,
        },
      });
      if (!user) return done(err);
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
