import {
    body,
    param,
    validationResult
} from 'express-validator'
import { 
    ERROR_CODES, 
    reportInvalidAddressError, 
    reportInvalidBookIdError, 
    reportInvalidOrderQuantityError 
} from '../shared/utils/errors.js'


export let addToCartValidationRules = [
    // check if book_id exists in the request body, is not
    // not empty and is a valid MongoDb ID string
    body("book_id")
        .exists()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail()
        .isLength({ min: 2 })
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail(),
    // check if the quantity exists in the request body, is not
    // not empty and is a valid integer with a minimum value of 1
    body("quantity")
        .exists()
        .withMessage( ERROR_CODES.INVALID_ORDER_QUANTITY )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_ORDER_QUANTITY )
        .bail()
        .isInt({ min: 1 })
        .withMessage( ERROR_CODES.INVALID_ORDER_QUANTITY )
        .bail()
]

export function cartValidationFunction( req, res, next ) {
    // get validation errors from the request 
    // if any
    let errors = validationResult( req )

    // if any validation errors, map the first error to it's
    // validation message and report it in the response
    if ( !errors.isEmpty() ) {
        switch( errors.array()[0].msg ) {
            case ERROR_CODES.INVALID_BOOK_ID:
                return reportInvalidBookIdError( next )
            case ERROR_CODES.INVALID_ORDER_QUANTITY:
                return reportInvalidOrderQuantityError( next )
        }
    }

    // if no errors in request, proceed to the next middleware
    // or route handler
    next()
}

export let updateCartValidationRules = [
    // check if book_id exists in the request param, is not
    // not empty and is a valid MongoDb ID string
    param("book_id")
        .exists()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail()
        .isMongoId()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail(),
    // check if the quantity exists in the request body, is not
    // not empty and is a valid integer with a minimum value of 1
    body("quantity")
        .exists()
        .withMessage( ERROR_CODES.INVALID_ORDER_QUANTITY )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_ORDER_QUANTITY )
        .bail()
        .isInt({ min: 1 })
        .withMessage( ERROR_CODES.INVALID_ORDER_QUANTITY )
        .bail()
]

export let deleteFromCartValidationRules = [
    // check if book_id exists in the request param, is not
    // not empty and is a valid MongoDb ID string
    param("book_id")
        .exists()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail()
        .isMongoId()
        .withMessage( ERROR_CODES.INVALID_BOOK_ID )
        .bail(),
]

export let addressValidationRules = [
    // check if address exists in request body, is not empty
    // and is a string of at least 5 chars ( dummy check but most 
    // address usually more than 5 chars long )
    body("address")
        .exists()
        .withMessage( ERROR_CODES.INVALID_ADDRESS )
        .bail()
        .notEmpty()
        .withMessage( ERROR_CODES.INVALID_ADDRESS )
        .bail()
        .isLength({ min: 5 })
        .withMessage( ERROR_CODES.INVALID_ADDRESS )
        .bail()
]

export async function addressValidationFunction( req, res, next ) {
    // get invalid address error from the request if it
    // was encountered
    let errors = validationResult( req )

    // report the invalid address error if it was encountered 
    // from teh request
    if ( !errors.isEmpty() ) {
        return reportInvalidAddressError( next )
    }

    // if no error was encountered, move to the next middleware
    // or route handler
    next()
}