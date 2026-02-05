import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as localStrategy } from "passport-local";
import prisma from "../lib/prisma.js";

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
