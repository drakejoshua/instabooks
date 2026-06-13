import express from 'express';
import passport from 'passport'
import { googleAuthController, verifyGoogleAuthController } from './auth.controller.js';
import { googleAuthVerifyValidationFunction, googleAuthVerifyValidationRules } from './auth.validators.js';

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

export default router;