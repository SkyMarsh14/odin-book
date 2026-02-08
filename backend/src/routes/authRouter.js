import { Router } from "express";
import authController from "../controllers/authController.js";
import imgUpload from "../middleware/imgUpload.js";
import passport from "passport";
const authRouter = Router();

authRouter.post(
  "/sign-up",
  imgUpload.single("image"),
  authController.createUser,
);
authRouter.post(
  "/login",
  passport.authenticate("local", { session: true }),
  authController.login,
);
authRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], session: true }),
);
authRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: true,
    failureRedirect: process.env.CLIENT_URL,
  }),
  (req, res) => {
    res.cookie["connect.sid"] = req.cookies["connect.sid"];
    return res.redirect(process.env.CLIENT_URL);
  },
);
authRouter.get("/guest-login", authController.guestLogin);
authRouter.get("/github/login", authController.githubLogin);
authRouter.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.json("Successfully logged out ");
});

export default authRouter;
