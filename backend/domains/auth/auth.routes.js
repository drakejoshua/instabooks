import express from 'express';
import passport from 'passport'
import { 
    googleAuthController, 
    logoutAuthController, 
    profileAuthController, 
    refreshAuthController, 
    verifyGoogleAuthController 
} from './auth.controller.js';
import { 
    googleAuthVerifyValidationFunction, 
    googleAuthVerifyValidationRules, 
    bearerAuthValidationFunction,
    bearerAuthValidationRules,
    refreshAuthValidationRules
} from './auth.validators.js';
import cookieParser from 'cookie-parser'


const router = express.Router();


// initialize cookie parser on router in order to allow
// child routes have access to cookies
router.use( cookieParser() )


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

router.post("/refresh",
    refreshAuthValidationRules,
    bearerAuthValidationFunction,
    refreshAuthController
)


export default router;