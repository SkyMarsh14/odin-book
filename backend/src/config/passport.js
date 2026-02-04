import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "../lib/prisma.js";

const extractCookie = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};
const opts = {
  jwtFromRequest: extractCookie,
  secretOrKey: process.env.TOKEN_SECRET,
};
passport.use(
  new JwtStrategy(opts, async (payload, done) => {
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
