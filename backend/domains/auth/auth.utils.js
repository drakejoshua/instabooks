// import jsonwebtoken for generating and verifying 
// JWT tokens
import jwt from 'jsonwebtoken'


// import environment variables for JWT secret and token 
// expiry times
const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY


// generateAccessToken()
// This utility function generates a JWT access token for the authenticated user.
// It takes the user object as input, signs it with the JWT secret, and sets the 
// token's expiry time based on the configured environment variable.
export function generateAccessToken( user ) {
    return jwt.sign( 
        { userId: user._id },
        JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

// generateRefreshToken()
// This utility function generates a JWT refresh token for the authenticated user.
// It takes the user object as input, signs it with the JWT secret, and sets the 
// token's expiry time based on the configured environment variable.
export function generateRefreshToken( user ) {
    return jwt.sign( 
        { userId: user._id },
        JWT_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}


// verifyJWT()
// This utility function verifies a given JWT token.
// It takes the token as input and uses the JWT secret to validate it.
// If the token is valid, it returns the decoded payload; otherwise, it throws an error.
export function verifyJWT( token ) {
    return jwt.verify(
        token,
        JWT_SECRET
    )
}


// hydrateUserToModel()
// This utility function checks if the provided user object is a 
// plain object (e.g., retrieved from cache) and hydrates it into 
// a Mongoose model instance.
// If the user is already a Mongoose model instance, it returns it as is.
export function hydrateUserToModel( user ) {
    if ( !( user instanceof Document ) ) {
        // hydrate the plain object gotten from the cache during 
        user = Users.hydrate( user )
    }

    return user;
}