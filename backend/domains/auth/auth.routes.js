import express from "express";
import passport from "passport";
import {
  googleAuthController,
  logoutAuthController,
  profileAuthController,
  profileUpdateAuthController,
  refreshAuthController,
  verifyGoogleAuthController,
} from "./auth.controller.js";
import {
  googleAuthVerifyValidationFunction,
  googleAuthVerifyValidationRules,
  refreshAuthValidationRules,
  profileUpdateAuthValidationRules,
  profileUpdateAuthValidationFunction,
} from "./auth.validators.js";
import {
  bearerAuthValidationFunction,
  bearerAuthValidationRules
} from "../shared/shared.validators.js";
import cookieParser from "cookie-parser";
import upload from "../shared/middleware/multer.js";

const router = express.Router();

// initialize cookie parser on router in order to allow
// child routes have access to cookies
router.use(cookieParser());

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthController,
);

router.get(
  "/google/verify",
  googleAuthVerifyValidationRules,
  googleAuthVerifyValidationFunction,
  verifyGoogleAuthController,
);

router.get(
  "/logout",
  bearerAuthValidationRules,
  bearerAuthValidationFunction,
  passport.authenticate("jwt", { session: false }),
  logoutAuthController,
);

router.get(
  "/me",
  bearerAuthValidationRules,
  bearerAuthValidationFunction,
  passport.authenticate("jwt", { session: false }),
  profileAuthController,
);

router.post(
  "/refresh",
  refreshAuthValidationRules,
  bearerAuthValidationFunction,
  refreshAuthController,
);

router.post(
  "/update",
  upload.single("photo"),
  bearerAuthValidationRules,
  bearerAuthValidationFunction,
  profileUpdateAuthValidationRules,
  profileUpdateAuthValidationFunction,
  passport.authenticate("jwt", { session: false }),
  profileUpdateAuthController,
);

export default router;
