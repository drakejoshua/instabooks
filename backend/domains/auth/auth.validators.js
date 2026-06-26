import { query, validationResult, header, cookie, body } from 'express-validator'
import { ERROR_CODES, reportInvalidAuthIdError, reportInvalidAuthorizationTokenError, reportInvalidOperationError, reportInvalidUsernameError } from '../../utils/errors.js'

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

export let profileUpdateAuthValidationRules = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_USER_NAME )
        .bail()
        .isLength({ min: 3 })
        .withMessage( ERROR_CODES.INVALID_USER_NAME )
        .bail(),
    query("deletePhoto")
        .optional()
        .isBoolean()
        .withMessage( ERROR_CODES.INVALID_OPERATION )
]

export function profileUpdateAuthValidationFunction( req, res, next ) {
    // get validation errors from request object if any
    const errors = validationResult( req )

    // check if there are any validation errors and 
    // report them if any
    if ( !errors.isEmpty() ) {
        switch( errors.array()[0].msg ) {
            case ERROR_CODES.INVALID_USER_NAME:
                return reportInvalidUsernameError( next )
            case ERROR_CODES.INVALID_OPERATION:
                return reportInvalidOperationError( next )
        }
    }

    // if no errors proceed to next middleware or 
    // controller
    next()
}