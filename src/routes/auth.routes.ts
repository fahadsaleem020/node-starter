import {
  insertDevice,
  isAuthenticated,
  isUnAuthenticated,
} from "@/middlewares/auth.middleware";
import requestPasswordResetController from "@/controllers/requestpasswordreset.controller";
import resetPasswordController from "@/controllers/resetpassword.controller";
import verifyEmailController from "@/controllers/verifyemail.controller";
import logoutController from "@/controllers/logout.controller";
import signupController from "@/controllers/signup.controller";
import userController from "@/controllers/user.controller";
import { getHttpStatusCode } from "@/utils/auth";
import { Router } from "express";
import passport from "passport";
import { config } from "dotenv";

config();
const routes = Router();

routes.post(
  "/signin",
  isUnAuthenticated,
  passport.authenticate("local"),
  insertDevice,
  (req, res) => {
    res.send("logged in");
  }
);

routes.post("/signup", isUnAuthenticated, signupController);

routes.put(
  "/verify",
  isUnAuthenticated,
  verifyEmailController,
  insertDevice,
  (_, res) => {
    res.send("Successfully verified");
  }
);

routes.get(
  "/verify/:code",
  isUnAuthenticated,
  verifyEmailController,
  insertDevice,
  (req, res) => {
    const isRequestSentFromAxios =
      req.headers["user-agent"] && req.headers.referer;
    if (isRequestSentFromAxios) {
      res.send("Successfully verified");
    } else {
      res.redirect(getHttpStatusCode("FOUND"), process.env.CLIENT_DOMAIN!);
    }
  }
);

routes.get("/user", isAuthenticated, userController);

routes.post(
  "/requestpasswordreset",
  isUnAuthenticated,
  requestPasswordResetController
);

routes.post(
  "/resetpassword",
  isUnAuthenticated,
  resetPasswordController,
  (_, res) => {
    res.send("Password reset successful.");
  }
);

routes.delete("/signout", isAuthenticated, logoutController);

export default routes;
