import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import Users from "../user.model.js";
import { UserNotFoundError } from "../utils/errors.js";

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
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // get existing user in the database if any using the email
                // provided by google profile
                let user = await Users.findOne({ email: profile.emails[0].value });

                // if user does not exist, create a new user in the
                // database using the information provided by google
                // profile
                if (!user) {
                    user = await Users.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photo_url: profile.photos[0].value,
                    });
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
        },
        async function (payload, done) {
            try {
                const authenticatedUser = await Users.findById(payload.userId);

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
