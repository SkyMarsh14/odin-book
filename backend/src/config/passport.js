import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github";
import prisma from "../lib/prisma.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
};
passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }),
);
