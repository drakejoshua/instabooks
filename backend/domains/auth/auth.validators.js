import { query, validationResult, header, cookie } from 'express-validator'
import { ERROR_CODES, reportInvalidAuthIdError, reportInvalidAuthorizationTokenError } from '../../utils/errors.js'

export let googleAuthVerifyValidationRules = [
    query("authId")
        .exists()
        .withMessage( ERROR_CODES.INVALID_AUTH_ID )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_AUTH_ID )
        .bail()
]

export function googleAuthVerifyValidationFunction( req, res, next ) {
    const errors = validationResult( req )

    if ( !errors.isEmpty() ) {
        return reportInvalidAuthIdError( next )
    }

    next()
}

export let bearerAuthValidationRules = [
    header("Authorization")
        .exists()
        .withMessage( ERROR_CODES.INVALID_AUTHORIZATION_TOKEN )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_AUTHORIZATION_TOKEN )
        .bail()
        .custom( function( value ) {
            const token = value.split(" ")[1]

            if ( !token ) {
                throw new Error()
            }

            return true
        })
        .withMessage( ERROR_CODES.INVALID_AUTHORIZATION_TOKEN )
]

export function bearerAuthValidationFunction( req, res, next ) {
    let errors = validationResult( req )

    if ( !errors.isEmpty() ) {
        return reportInvalidAuthorizationTokenError( next )
    }

    next() 
}

export let refreshAuthValidationRules = [
    cookie("refresh_token")
        .exists()
        .withMessage( ERROR_CODES.INVALID_AUTHORIZATION_TOKEN )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_AUTHORIZATION_TOKEN )
        .bail()
]