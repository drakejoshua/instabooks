import { UserNotFoundError } from "../../utils/errors.js";
import User from "./auth.model.js";
import { generateAccessToken, generateRefreshToken } from "./auth.utils.js";
import crypto from 'crypto'

export async function googleAuthService( authUser ) {
    // generate refresh token and google auth id for
    // authenticated user
    let googleAuthId = crypto.randomUUID()

    // update user data in database with refresh token and
    // auth id for further authentication
    authUser.google_auth_id = googleAuthId;
    await authUser.save()

    // return user data for use in controller
    return authUser
}

export async function verifyGoogleAuthService( authId ) {
    // get user authenticated by google using authId from
    // database
    const authUser = await User.findOne({ google_auth_id: authId })

    if ( !authUser ) {
        throw UserNotFoundError
    }

    // generate access token and refresh token for
    // authenticated user
    let refreshToken = generateRefreshToken( authUser )
    let accessToken = generateAccessToken( authUser )

    // update user data in database with refresh token and
    // for further authentication
    authUser.refresh_token = refreshToken;
    await authUser.save()

    // return response data for use in controller
    return {
        refresh_token: refreshToken,
        user: {
            ...authUser.getProfileData(),
            access_token: accessToken,
            expires_in: 15 * 60    // access token expires in 15 mins
        }
    }
}