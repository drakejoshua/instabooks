// import express-validator for validating request parameters, 
// headers, cookies, and body in the authentication domain
import {
    query,
    validationResult,
    header,
    cookie,
    body,
} from "express-validator";

// import error reporting functions and error codes for handling
// validation errors in the authentication domain
import {
    ERROR_CODES,
    reportInvalidAuthIdError,
    reportInvalidOperationError,
    reportInvalidUsernameError,
} from "../shared/utils/errors.js";


// googleAuthVerifyValidationRules - This array of validation rules 
// is used to validate the query parameters for the Google OAuth2 
// authentication verification endpoint. It checks for the existence 
// and non-emptiness of the "authId" query parameter, ensuring that 
// it is provided and valid.
export let googleAuthVerifyValidationRules = [
    query("authId")
        .exists()
        .withMessage(ERROR_CODES.INVALID_AUTH_ID)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_AUTH_ID)
        .bail(),
];


// googleAuthVerifyValidationFunction()
// This function is a middleware that checks for validation errors
// in the request object after applying the googleAuthVerifyValidationRules.
// If there are any validation errors, it reports an invalid auth ID error.
// If there are no errors, it proceeds to the next middleware or controller.
export function googleAuthVerifyValidationFunction(req, res, next) {
    // get validation errors from request object if any
    const errors = validationResult(req);

    // check if there are any validation errors and report them if any
    if (!errors.isEmpty()) {
        return reportInvalidAuthIdError(next);
    }

    // if no errors proceed to next middleware or controller
    next();
}


// refreshAuthValidationRules - This array of validation rules is used to
// validate the "refresh_token" cookie in requests that require refresh 
// token authentication. It checks for the existence and non-emptiness 
// of the cookie, ensuring that a valid refresh token is provided.
export let refreshAuthValidationRules = [
    cookie("refresh_token")
        .exists()
        .withMessage(ERROR_CODES.INVALID_AUTHORIZATION_TOKEN)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_AUTHORIZATION_TOKEN)
        .bail(),
];


// profileUpdateAuthValidationRules - This array of validation rules is used to
// validate the request body and query parameters for profile update requests.
// It checks for the optional "name" field in the request body, ensuring that
// if provided, it is not empty and has a minimum length of 3 characters.
// It also checks for the optional "deletePhoto" query parameter, ensuring
// that if provided, it is a boolean value.
export let profileUpdateAuthValidationRules = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_USER_NAME)
        .bail()
        .isLength({ min: 3 })
        .withMessage(ERROR_CODES.INVALID_USER_NAME)
        .bail(),
    query("deletePhoto")
        .optional()
        .isBoolean()
        .withMessage(ERROR_CODES.INVALID_OPERATION)
];


// profileUpdateAuthValidationFunction()
// This function is a middleware that checks for validation errors
// in the request object after applying the profileUpdateAuthValidationRules.
// If there are any validation errors, it reports the corresponding error
// based on the first validation error encountered. If there are no errors,
// it proceeds to the next middleware or controller.
export function profileUpdateAuthValidationFunction(req, res, next) {
    // get validation errors from request object if any
    const errors = validationResult(req);

    // check if there are any validation errors and
    // report them if any
    if (!errors.isEmpty()) {
        switch (errors.array()[0].msg) {
        case ERROR_CODES.INVALID_USER_NAME:
            return reportInvalidUsernameError(next);
        case ERROR_CODES.INVALID_OPERATION:
            return reportInvalidOperationError(next);
        }
    }

    // if no errors proceed to next middleware or
    // controller
    next();
}
