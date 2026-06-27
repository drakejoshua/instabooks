import {
  cloudinaryDelete,
  cloudinaryUpload,
} from "../shared/utils/cloudinary.js";
import {
  InvalidAuthorizationTokenError,
  UserNotFoundError,
} from "../shared/utils/errors.js";
import User from "../shared/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJWT,
} from "./auth.utils.js";
import crypto from "crypto";

export async function googleAuthService(authUser) {
  // generate refresh token and google auth id for
  // authenticated user
  let googleAuthId = crypto.randomUUID();

  // update user data in database with refresh token and
  // auth id for further authentication
  authUser.google_auth_id = googleAuthId;
  await authUser.save();

  // return user data for use in controller
  return authUser;
}

export async function verifyGoogleAuthService(authId) {
  // get user authenticated by google using authId from
  // database
  const authUser = await User.findOne({ google_auth_id: authId });

  if (!authUser) {
    throw UserNotFoundError;
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

  // return response data for use in controller
  return {
    refresh_token: refreshToken,
    user: {
      ...authUser.getProfileData(),
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

export async function refreshAuthService(token) {
  try {
    // check if the token is valid JWT and not expired
    const user = verifyJWT(token);
  } catch (err) {
    throw InvalidAuthorizationTokenError;
  }

  // get user with refresh_token stored in their name from
  // the database
  let authUser = await User.findOne({ refresh_token: token });

  // check if user with refresh_token exists,
  // if user is found, generate access token using user data and
  // return data
  if (authUser) {
    let accessToken = generateAccessToken(authUser);
    let accessTokenExpiry = 15 * 60; // 15 mins

    return { accessToken, accessTokenExpiry };
  } else {
    // if no user is found, return a user not found error
    throw UserNotFoundError;
  }
}

export async function profileUpdateAuthService(
  user,
  updateData,
  isDeletePhoto,
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

    return user.getProfileData();
  }

  // check if user wants to update their profile photo and
  // upload new photo to cloudinary if true and save changes
  // to user document
  if (updateData.photo) {
    let uploadResult = await cloudinaryUpload(updateData.photo.buffer);

    user.photo_url = uploadResult.secure_url;
    user.photo_id = uploadResult.public_id;

    await user.save();

    return user.getProfileData();
  }

  // if user does not want to update their profile photo,
  // just save the changes to user document and return updated
  // user data
  await user.save();

  return user.getProfileData();
}
