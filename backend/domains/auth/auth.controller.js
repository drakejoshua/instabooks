// import the necessary services from the auth service module
import {
    googleAuthService,
    logoutAuthService,
    profileUpdateAuthService,
    refreshAuthService,
    verifyGoogleAuthService,
} from "./auth.service.js";

// define the configuration for the refresh token cookie,
// including security settings and expiration time
let refreshTokenCookieConfig = {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

// googleAuthController()
// This controller handles the Google OAuth2 authentication flow.
// It retrieves the authenticated user from the request, invokes
// the googleAuthService to process the user data, and redirects
// the user to the frontend with their Google auth ID.
export async function googleAuthController(req, res, next) {
    // get user db model from request
    const authUser = req.user;

    try {
        // invoke auth service with user data and get respData
        const respData = await googleAuthService(authUser, req);

        // return redirect to frontend URL
        res.redirect(
            `${process.env.FRONTEND_URL}/auth/google/verify/${respData.google_auth_id}`,
        );
    } catch (err) {
        return next(err);
    }
}

// verifyGoogleAuthController()
// This controller handles the verification of Google OAuth2 authentication tokens.
// It retrieves the Google auth ID from the request query parameters, invokes the
// verifyGoogleAuthService to validate the token, and returns the authenticated user data.
export async function verifyGoogleAuthController(req, res, next) {
    // get google auth id from request query params
    const googleAuthId = req.query.authId;

    try {
        // invoke auth service to verify googleAuthId from database
        // and return response data
        const { refresh_token, user } = await verifyGoogleAuthService(
            googleAuthId,
            req,
        );

        // add refresh token as cookie in the response
        res.cookie("refresh_token", refresh_token, refreshTokenCookieConfig);

        // return success response with authenticated user data
        res.json({
            status: "success",
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

// logoutAuthController()
// This controller handles the logout process for authenticated users.
// It invokes the logoutAuthService to clear the refresh token from the
// user's record in the database, clears the refresh token cookie in
// the response, and sends a confirmation message back to the client.
export async function logoutAuthController(req, res, next) {
    try {
        // call logout auth service to clear refresh token
        // from user in database
        const { message } = await logoutAuthService(req.user, req);

        // clear refresh_token http cookie in response
        res.clearCookie("refresh_token", refreshTokenCookieConfig);

        // send response confirming logout action
        res.json({
            status: "success",
            data: {
                message,
            },
        });
    } catch (err) {
        next(err);
    }
}

// profileAuthController()
// This controller handles the retrieval of the authenticated user's profile data.
// It invokes the getProfileData method on the user model to fetch the user's profile
// information and sends it back in the response.
export async function profileAuthController(req, res, next) {
    // return profile details from authenticated user by passport
    // in request
    res.json({
        status: "success",
        data: {
            ...( await req.user.getProfileData() ),
        },
    });
}

// refreshAuthController()
// This controller handles the refresh of authentication tokens.
// It retrieves the refresh token from the request cookies, invokes
// the refreshAuthService to generate a new access token, and sends
// the new access token and its expiration time back in the response.
export async function refreshAuthController(req, res, next) {
    // get cookie containing the refresh token from the request object
    const refreshToken = req.cookies.refresh_token;

    try {
        // invoke the refresh service with refresh token to generate
        // new access token
        let { accessToken, accessTokenExpiry } = await refreshAuthService(
            refreshToken,
            req,
        );

        // return generated access token in response
        res.json({
            status: "success",
            data: {
                access_token: accessToken,
                expires_in: accessTokenExpiry,
            },
        });
    } catch (err) {
        next(err);
    }
}

// profileUpdateAuthController()
// This controller handles the update of the authenticated user's profile information.
// It retrieves the updated data from the request body and query parameters, invokes
// the profileUpdateAuthService to update the user's profile in the database, and
// returns the updated user data in the response.
export async function profileUpdateAuthController(req, res, next) {
    // get updated user data from request body and query params
    const name = req.body?.name;
    const deletePhoto = req.query.deletePhoto === "true" ? true : false;
    const photo = req.file;
    let updateData = { name, photo };

    try {
        // invoke auth service to update user profile with new data
        const updatedUser = await profileUpdateAuthService(
            req.user,
            updateData,
            deletePhoto,
            req,
        );

        // return updated user data in response
        res.json({
            status: "success",
            data: {
                user: updatedUser,
            },
        });
    } catch (err) {
        next(err);
    }
}
