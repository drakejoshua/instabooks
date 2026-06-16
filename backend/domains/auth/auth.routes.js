import express from 'express';
import passport from 'passport'
import { 
    googleAuthController, 
    logoutAuthController, 
    profileAuthController, 
    verifyGoogleAuthController 
} from './auth.controller.js';
import { 
    googleAuthVerifyValidationFunction, 
    googleAuthVerifyValidationRules, 
    bearerAuthValidationFunction,
    bearerAuthValidationRules
} from './auth.validators.js';

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
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("jwt", { session: false }),
    logoutAuthController
)

router.get("/me",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("jwt", { session: false }),
    profileAuthController
)

export default router;