import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as CustomStrategy } from 'passport-custom'
import Users from "../../database/models/user.model.js";
import { InvalidAdminKeyError, UserNotFoundError } from "../../domains/shared/utils/errors.js";
import {
    CacheKeys,
    CacheOperations,
    CacheUpdate
} from "../../cache/utils.js";
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
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    // get existing user id in the cache if any using the
                    // email provided by google profile
                    let userId = await CacheOperations.getCache(
                        req,
                        CacheKeys.userByEmail(profile.emails[0].value),
                    );
                    let user = null;

                    // check if a valid user id was returned for the email, if not,
                    // retrieve the user id and profile info from the database using the
                    // email ( preventing a double query to the database if the user id
                    // is already cached )
                    if (!userId) {
                        // if no user id is found in the cache, retrieve the user id
                        // from the database
                        let userData = await Users.findOne({
                            email: profile.emails[0].value,
                        });

                        // if no user is found in the database, throw a user not
                        // found error
                        if (!userData) {
                            // create user in database using google profile info
                            userData = await Users.create({
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                photo_url: profile.photos[0].value,
                            });
                        }

                        user = userData;
                        userId = userData._id;
                    }

                    if (user) {
                        // populate redis cache with email key to index the
                        // user's id and a user:id key to contain actual profile
                        // info
                        await CacheUpdate.updateUserById(user, req);
                    } else {
                        user = await CacheOperations.getAndHydrateUserById(
                            userId,
                            req,
                        );
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
                passReqToCallback: true,
            },
            async function (req, payload, done) {
                try {
                    let authenticatedUser =
                        await CacheOperations.getAndHydrateUserById(
                            payload.userId,
                            req,
                        );

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


    // initialize passport with custom strategy for admin key 
    // authentication. This strategy allows users to authenticate 
    // using a custom admin key, which is sent in the Authorization 
    // header of the request. The key is verified against a predefined 
    // value, and if valid, the user is granted access to admin-level 
    // resources.
    passport.use(
        "admin-key",
        new CustomStrategy(
            async function( req, done ) {
                let adminKey = req.headers.authorization?.split(" ")[1]

                if ( !adminKey ) {
                    return done( InvalidAdminKeyError, false )
                }

                if ( adminKey !== process.env.ADMIN_KEY ) {
                    return done( InvalidAdminKeyError, false )
                }

                return done( null, true )
            }
        )
    )
}
