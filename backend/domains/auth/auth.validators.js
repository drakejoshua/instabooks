import { query, validationResult } from 'express-validator'
import { ERROR_CODES, reportInvalidAuthIdError } from '../../utils/errors.js'

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