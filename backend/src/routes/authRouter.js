import { Router } from "express";
import authController from "../controllers/authController.js";
import imgUpload from "../middleware/imgUpload.js";
import passport from "passport";
const authRouter = Router();

authRouter.post(
  "/create-user",
  imgUpload.single("image"),
  authController.createUser,
);
authRouter.post("/login", authController.login);
authRouter.get("/guest-login", authController.guestLogin);
authRouter.get("/auth/error", (req, res) => res.json({ msg: "Unknown Error" }));
authRouter.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);
authRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/error" }),
  function (req, res) {
    res.redirect("http://localhost:5173/");
  },
);
authRouter.get("/", (req, res) => {
  res.json(`Hello World ${req.user.displayName}`);
});
export default authRouter;
