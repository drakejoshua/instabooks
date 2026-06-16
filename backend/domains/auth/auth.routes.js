import express from 'express';
import passport from 'passport'
import { googleAuthController, logoutAuthController, verifyGoogleAuthController } from './auth.controller.js';
import { googleAuthVerifyValidationFunction, googleAuthVerifyValidationRules, logoutValidationFunction, logoutValidationRules } from './auth.validators.js';

const router = express.Router();

router.get("/google", 
    passport.authenticate( "google", { scope: ['email', 'profile']} )
)

router.get("/google/callback",
    passport.authenticate( 'google', { session: false } ),
    googleAuthController
)

router.get("/google/verify",
    googleAuthVerifyValidationRules,
    googleAuthVerifyValidationFunction,
    verifyGoogleAuthController
)

router.get("/logout",
    logoutValidationRules,
    logoutValidationFunction,
    passport.authenticate("jwt", { session: false }),
    logoutAuthController
)

export default router;