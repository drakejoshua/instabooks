import { googleAuthService, verifyGoogleAuthService } from "./auth.service.js"

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
        res.cookie( 'refresh_token', refresh_token, {
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7  // 7 days
        })

        // return success response with authenticated user data
        res.json({
            status: "success",
            data: user
        })
    } catch( err ) {
        next( err )
    }

}