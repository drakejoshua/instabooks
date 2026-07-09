// import utility functions for handling cloudinary operations
// e.g. uploading and deleting files, as well as error handling
import {
    cloudinaryDelete,
    cloudinaryUpload,
} from "../../infra/utils/cloudinary.js";

// import error objects for handling error occurences in the
// authentication service functions
import {
    InvalidAuthorizationTokenError,
    UserNotFoundError,
} from "../shared/utils/errors.js";

// import the User model for interacting with the user collection
// on the database
import Users from "../../database/models/user.model.js";

// import utility functions for generating and verifying JWT tokens
import {
    generateAccessToken,
    generateRefreshToken,
    verifyJWT,
} from "./auth.utils.js";

// import crypto module for generating unique identifiers for Google auth IDs
import crypto from "crypto";

import {
    CacheKeys,
    CacheOperations,
    CacheUpdate
} from "../../cache/utils.js";

// googleAuthService()
// This service function handles the Google OAuth2 authentication flow.
// It generates a unique Google auth ID for the authenticated user,
// updates the user's record in the database with this ID, and returns
// the updated user data for further processing in the controller.
export async function googleAuthService(authUser, req = null) {
    // generate refresh token and google auth id for
    // authenticated user
    let googleAuthId = crypto.randomUUID();

    // update user data in database with the google auth id for
    // further authentication
    authUser.google_auth_id = googleAuthId;
    await authUser.save();

    // update user id cache info with updated user data
    // ( i.e google_auth_id ) for faster access in future requests
    await CacheUpdate.updateUserByGoogleAuthId(authUser, req);

    // return user data for use in controller
    return authUser;
}

// verifyGoogleAuthService()
// This service function verifies the Google OAuth2 authentication token.
// It retrieves the user associated with the provided Google auth ID from
// the database, generates new access and refresh tokens, updates the user's
// record with the new refresh token, and returns the authenticated user data.
export async function verifyGoogleAuthService(authId, req = null) {
    // get existing user id in the cache if any using the
    // auth id provided by the controller
    let userId = await CacheOperations.getCache(
        req,
        CacheKeys.userByGoogleAuthId(authId),
    );
    let authUser;

    // check if a valid user id was returned for the auth id, if not,
    // retrieve the user id and profile info from the database using the
    // auth id ( preventing a double query to the database if the user id
    // is already cached )
    if (!userId) {
        // if no user id is found in the cache, retrieve the user id
        // from the database
        let userData = await Users.findOne({ google_auth_id: authId });

        // if no user is found in the database, throw a user not
        // found error
        if (!userData) {
            throw UserNotFoundError;
        } else {
            authUser = userData;
            userId = authUser._id;
        }
    }

    // if there's user id in the cache, retrieve the user profile
    // info using the user id
    if (!authUser) {
        authUser = await CacheOperations.getAndHydrateUserById(userId, req);
    }

    // generate access token and refresh token for
    // authenticated user
    let refreshToken = generateRefreshToken(authUser);
    let accessToken = generateAccessToken(authUser);

    // remove google auth id from user data to prevent
    // deuplication and security risks
    authUser.google_auth_id = null;

    // update user data in database with refresh token and
    // for further authentication
    authUser.refresh_token = refreshToken;
    await authUser.save();

    // update user id cache info with updated user data ( i.e refresh
    // token and google_auth_id )
    await CacheUpdate.updateUserById(authUser, req);

    // cache refresh token as an index key to point to the authenticated
    // user cache info
    await CacheUpdate.updateUserByRefreshToken(authUser, req);

    // delete google auth id cache key to prevent duplicate indexes to
    // the same user
    await CacheOperations.deleteCache(
        req,
        CacheKeys.userByGoogleAuthId(authId),
    );

    // return response data for use in controller
    return {
        refresh_token: refreshToken,
        user: {
            ...( await authUser.getProfileData() ),
            access_token: accessToken,
            expires_in: 15 * 60, // access token expires in 15 mins
        },
    };
}

export async function logoutAuthService(user) {
    // clear refresh_token from user data on the database
    user.refresh_token = null;

    // save user document to reflect changes
    await user.save();

    return {
        message: "user logged out successfully",
    };
}

export async function refreshAuthService(token, req = null) {
    try {
        // check if the token is valid JWT and not expired
        const user = verifyJWT(token);
    } catch (err) {
        throw InvalidAuthorizationTokenError;
    }

    // get user with refresh_token cache key
    let userId = await CacheOperations.getCache(
        req,
        CacheKeys.userByRefreshToken(token),
    );
    let authUser;

    // check if a valid user id was returned for the refresh token,
    // if not, retrieve the user id and profile info from the database
    // using the refresh token ( preventing a double query to the database
    // if the user id is already cached )
    if (!userId) {
        // if no user id is found in the cache, retrieve the user id
        // from the database
        let userData = await Users.findOne({ refresh_token: token });

        // if no user is found in the database, throw a user not found error
        if (!userData) {
            throw UserNotFoundError;
        } else {
            userId = userData._id;
            authUser = userData;
        }
    }

    // if there's user id in the cache, retrieve the user profile
    // info using the user id
    if (!authUser) {
        authUser = await CacheOperations.getAndHydrateUserById(userId, req);
    }

    // check if user with refresh_token exists,
    // if user is found, generate access token using user data and
    // return data
    if (authUser) {
        let accessToken = generateAccessToken(authUser);
        let accessTokenExpiry = 15 * 60; // 15 mins

        return { accessToken, accessTokenExpiry };
    } else {
        // if no user is found, throw a user not found error
        throw UserNotFoundError;
    }
}

export async function profileUpdateAuthService(
    user,
    updateData,
    isDeletePhoto,
    req
) {
    // check if user wants to update their profile name and
    // update user name in database if true
    if (updateData.name) {
        user.name = updateData.name;
    }

    // check if user wants to delete their profile photo
    // and delete photo from cloudinary if true and save changes
    // to user document
    if (isDeletePhoto && user.photo_id) {
        await cloudinaryDelete(user.photo_id);

        user.photo_url = "";
        user.photo_id = "";

        await user.save();

        // update user id cache info with updated user data ( i.e updated
        // user name or profile photo info )
        await CacheUpdate.updateUserById(user, req);

        return await user.getProfileData();
    }

    // check if user wants to update their profile photo and
    // upload new photo to cloudinary if true and save changes
    // to user document
    if (updateData.photo) {
        let uploadResult = await cloudinaryUpload(updateData.photo.buffer);

        user.photo_url = uploadResult.secure_url;
        user.photo_id = uploadResult.public_id;

        await user.save();

        // update user id cache info with updated user data ( i.e updated
        // user name or profile photo info )
        await CacheUpdate.updateUserById(user, req);

        return await user.getProfileData();
    }

    // if user does not want to update their profile photo,
    // just save the changes to user document and return updated
    // user data
    await user.save();

    return await user.getProfileData();
}
