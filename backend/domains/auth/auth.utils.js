import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY


export function generateAccessToken( user ) {
    return jwt.sign( 
        { userId: user._id },
        JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

export function generateRefreshToken( user ) {
    return jwt.sign( 
        { userId: user._id },
        JWT_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}