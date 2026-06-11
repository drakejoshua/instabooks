import express from 'express';
import passport from 'passport'

const router = express.Router();

router.get("/google", 
    passport.authenticate( "google", { session: false } )
)

export default router;