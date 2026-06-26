import { 
    googleAuthService, 
    logoutAuthService, 
    profileUpdateAuthService, 
    refreshAuthService, 
    verifyGoogleAuthService 
} from "./auth.service.js"

let refreshTokenCookieConfig = {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7  // 7 days
}


export async function googleAuthController( req, res, next ) {
    // get user db model from request
    const authUser = req.user

    try {
        // invoke auth service with user data and get respData
        const respData = await googleAuthService( authUser )

        // return redirect to frontend URL
        res.redirect(`${ process.env.FRONTEND_URL }/auth/google?id=${ respData.google_auth_id }`)
    } catch( err ) {
        return next( err )
    }
}

export async function verifyGoogleAuthController( req, res, next ) {
    // get google auth id from request query params
    const googleAuthId = req.query.authId

    try {
        // invoke auth service to verify googleAuthId from database
        // and return response data
        const { refresh_token, user } = await verifyGoogleAuthService( googleAuthId )

        // add refresh token as cookie in the response
        res.cookie( 
            'refresh_token', 
            refresh_token, 
            refreshTokenCookieConfig
        )

        // return success response with authenticated user data
        res.json({
            status: "success",
            data: user
        })
    } catch( err ) {
        next( err )
    }

}

export async function logoutAuthController( req, res, next ) {
    try {
        // call logout auth service to clear refresh token 
        // from user in database
        const { message } = await logoutAuthService( req.user )

        // clear refresh_token http cookie in response
        res.clearCookie( "refresh_token", refreshTokenCookieConfig )

        // send response confirming logout action
        res.json({
            status: "success",
            data: {
                message
            }
        })
    } catch( err ) {
        next( err )
    }
}

export async function profileAuthController( req, res, next ) {
    // return profile details from authenticated user by passport
    // in request
    res.json({
        status: "success",
        data: {
            user: {
                ...req.user.getProfileData()
            }
        }
    })
}

export async function refreshAuthController( req, res, next ) {
    // get cookie containing the refresh token from the request object
    const refreshToken = req.cookies.refresh_token

    try {
        // invoke the refresh service with refresh token to generate
        // new access token
        let { accessToken, accessTokenExpiry } = await refreshAuthService( refreshToken )

        // return generated access token in response
        res.json({
            status: "success",
            data: {
                access_token: accessToken,
                expires_in: accessTokenExpiry
            }
        })
    } catch( err ) {
        next( err )
    }
}

export async function profileUpdateAuthController( req, res, next ) {
    // get updated user data from request body and query params
    const name = req.body.name
    const deletePhoto = req.query.deletePhoto === "true" ? true : false
    const photo = req.file
    let updateData = { name, photo }

    try {
        // invoke auth service to update user profile with new data
        const updatedUser = await profileUpdateAuthService( req.user, updateData, deletePhoto )

        // return updated user data in response
        res.json({
            status: "success",
            data: {
                user: updatedUser
            }
        })
    } catch( err ) {
        next( err )
    }
}