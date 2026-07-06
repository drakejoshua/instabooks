// import express library to create a router for user related 
// routes
import express from "express";

// import passport library to handle authentication
import passport from "passport";

// import validation functions, rules and controllers for auth routes
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

// import cookie-parser middleware to parse cookies in the request
import cookieParser from "cookie-parser";

// import multer middleware to handle file uploads in the request
import upload from "../shared/middleware/multer.js";



// create a router for auth related routes
const router = express.Router();



// initialize cookie parser on router in order to allow
// child routes have access to cookies
router.use(cookieParser());


// GET /auth/google - initiate Google OAuth2 authentication flow
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] }),
);


// GET /auth/google/callback - handle the callback from Google OAuth2 
// authentication flow
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    googleAuthController,
);


// GET /auth/google/verify - verify the Google OAuth2 authentication
// token and retrieve user information
router.get(
    "/google/verify",
    googleAuthVerifyValidationRules,
    googleAuthVerifyValidationFunction,
    verifyGoogleAuthController,
);


// GET /auth/logout - log the user out by clearing the authentication
// cookies and tokens
router.get(
    "/logout",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("jwt", { session: false }),
    logoutAuthController,
);


// GET /auth/me - retrieve the authenticated user's profile information
router.get(
  "/me",
  bearerAuthValidationRules,
  bearerAuthValidationFunction,
  passport.authenticate("jwt", { session: false }),
  profileAuthController,
);


// POST /auth/refresh - refresh the authentication token using a valid
// refresh token and return a new access token
router.post(
  "/refresh",
  refreshAuthValidationRules,
  bearerAuthValidationFunction,
  refreshAuthController,
);


// POST /auth/update - update the authenticated user's profile information,
// including name, email, and profile photo
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


// export the router to be used in other parts of the 
// application
export default router;