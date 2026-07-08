import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import Users from "../../domains/shared/user.model.js";
import { UserNotFoundError } from "../../domains/shared/utils/errors.js";
import { getOrSetCache } from "../../cache/utils.js";
import redisClient from "../../cache/setup.js";

export default async function initializePassport(passport) {
    // initialize passport with Google OAuth2 strategy for authentication
    // using Google accounts. This strategy allows users to log in using their
    // Google credentials, and it retrieves user information from the Google
    // profile to create or update user records in the database.
    passport.use(
        new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            passReqToCallback: true
        },
        async ( req, accessToken, refreshToken, profile, done) => {
            try {
                // get existing user id in the cache if any using the 
                // email provided by google profile
                let userId = await getOrSetCache(
                    req,
                    `user:email:${ profile.emails[0].value }`,
                    async function() {
                        const userData = await Users.findOne({ email: profile.emails[0].value });

                        return userData._id
                    },
                    5 * 60          // cache expiration time in 5 mins 
                )
                

                // if user id does not exist, create a new user in the
                // database and cache using the information provided by 
                // google profile, else, get the user data using the 
                // retrieved user id from cache
                let user = null

                if (!userId) {
                    // create user in database using google profile info
                    user = await Users.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        photo_url: profile.photos[0].value,
                    });

                    // populate redis cache with email key to index the 
                    // user's id and a user:id key to contain actual profile
                    // info
                    await redisClient.setEx(
                        `user:id:${ user._id }`,
                        60 * 60,        // cache expiration time in 60 mins
                        user
                    )
                } else {
                    user = await getOrSetCache(
                        req,
                        `user:id:${ userId }`,
                        async function() {
                            return Users.findById( userId );
                        }
                    )
                }

                // return the user object to the passport
                // middleware
                return done(null, user);
            } catch (err) {
                // if there is an error during the process,
                // return the error to the passport middleware
                return done(err, null);
            }
        },
        ),
    );

    // initialize passport with JWT strategy for authentication
    // using JSON Web Tokens (JWT). This strategy allows users to authenticate
    // using a JWT token, which is typically sent in the Authorization header
    // of the request. The token is verified using the secret key, and if valid,
    // the user information is retrieved from the database.
    passport.use(
        new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        },
        async function ( req, payload, done) {
            try {
                let authenticatedUser = await getOrSetCache(
                    req,
                    `user:id:${ payload.userId }`,
                    async function() {
                        return Users.findById(payload.userId);
                    }
                )

                if (!authenticatedUser) {
                    return done(UserNotFoundError, false);
                }

                return done(null, authenticatedUser);
            } catch (err) {
                return done(err, false);
            }
        },
        ),
    );
}
