import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import Users from "../domains/auth/auth.model.js"
import { UserNotFoundError } from '../utils/errors.js'

export default async function initializePassport( passport ) {
    passport.use( new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async ( accessToken, refreshToken, profile, done ) => {
            try {
                // get existing user in the database if any using the email 
                // provided by google profile
                let user = await Users.findOne({ email: profile.emails[0].value })

                // if user does not exist, create a new user in the 
                // database using the information provided by google 
                // profile
                if (!user) {
                    user = await Users.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        photo_url: profile.photos[0].value
                    })
                }

                // return the user object to the passport 
                // middleware
                return done( null, user )
            } catch ( err ) {
                // if there is an error during the process, 
                // return the error to the passport middleware
                return done( err, null )
            }
        }
    ) )

    passport.use( new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async function( payload, done ) {
            try {
                const authenticatedUser = await Users.findById( payload.userId )

                if ( !authenticatedUser ) {
                    return done( UserNotFoundError, false )
                }

                return done( null, authenticatedUser )
            } catch( err ) {
                done( err, false )
            }
        }
    ))
}