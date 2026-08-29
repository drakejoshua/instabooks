import { query, param, body, validationResult } from "express-validator";
import {
    ERROR_CODES,
    reportInvalidAddressError,
    reportInvalidOrderReferenceError,
    reportInvalidRequestInfoError,
} from "../shared/utils/errors.js";

// checkout order validator rules
// This validator checks if the shipping address is provided 
// in the request body and if it is valid. It ensures that 
// the shipping address exists, is not empty, and has a 
// minimum length of 5 characters. If any of these conditions 
// are not met, it will return an error message indicating 
// that the address is invalid.
export let checkoutOrderValidatorRules = [
    body("shipping_address")
        .exists()
        .withMessage(ERROR_CODES.INVALID_ADDRESS)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_ADDRESS)
        .bail()
        .isLength({ min: 5 })
        .withMessage(ERROR_CODES.INVALID_ADDRESS)
        .bail(),
];

// checkoutOrderValidationFunction()
// This function is a middleware that validates the request for 
// checking out an order. It verifies if there's a invalid shipping 
// address in the request body. If there are validation errors, 
// it will report an invalid address error, else, it will 
// proceed to the next middleware.
export function checkoutOrderValidationFunction(req, res, next) {
    // get validation errors from the request
    // if any
    const errors = validationResult(req);

    // check if there are validation errors
    if (!errors.isEmpty()) {
        // report invalid address error if there
        // are validation errors
        return reportInvalidAddressError(next);
    }

    // proceed to the next middleware if there are no
    // validation errors
    next();
}

// confirmOrderPaymentValidatorRules
// This validator checks if the order reference is provided 
// in the request query and if it is valid. It ensures that 
// the order reference exists, is not empty, and is a valid 
// MongoDB ObjectId. If any of these conditions are not met, 
// it will return an error message indicating that the order
// reference is invalid.
export let confirmOrderPaymentValidatorRules = [
    query("reference")
        .exists()
        .withMessage(ERROR_CODES.INVALID_ORDER_REFERENCE)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_ORDER_REFERENCE)
        .bail()
        .isMongoId()
        .withMessage(ERROR_CODES.INVALID_ORDER_REFERENCE)
        .bail(),
];

// confirmOrderPaymentValidationFunction()
// This function is a middleware that validates the request for 
// confirming an order payment. It verifies if there's an invalid
// order reference in the request query. If there are validation errors, 
// it will report an invalid order reference error, else, it will 
// proceed to the next middleware.
export function confirmOrderPaymentValidationFunction(req, res, next) {
    // get validation errors from the request
    // if any
    const errors = validationResult(req);

    // check if there was invalid order reference
    // in the request body and redirect to the
    // frontend invalid order reference page if there
    // was an invalid order reference
    if (!errors.isEmpty()) {
        return reportInvalidOrderReferenceError(next);
    }

    // proceed to the next middleware if there are no
    // validation errors
    next();
}

// orderIdValidatorRules - This array of validation rules is used 
// to validate the "order_id" parameter in requests that require 
// an order ID. It checks for the existence, non-emptiness, and 
// validity of the order ID as a MongoDB ObjectId. If any of these 
// conditions are not met, it will return an error message 
// indicating that the order reference is invalid.
export let orderIdValidatorRules = [
    param("order_id")
        .exists()
        .withMessage(ERROR_CODES.INVALID_ORDER_REFERENCE)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_ORDER_REFERENCE)
        .bail()
        .isMongoId()
        .withMessage(ERROR_CODES.INVALID_ORDER_REFERENCE)
        .bail(),
];

// orderIdValidationFunction()
// This function is a middleware that validates the request for 
// operations that require an order ID. It verifies if there's an
// invalid order reference in the request parameters. If there are 
// validation errors, it will report an invalid order reference error, 
// else, it will proceed to the next middleware.
export function orderIdValidationFunction(req, res, next) {
    // get validation errors from the request
    // if any
    const errors = validationResult(req);

    // check if there was invalid order reference
    // in the request body and report an invalid order
    // reference error if there was
    if (!errors.isEmpty()) {
        return reportInvalidOrderReferenceError(next);
    }

    // proceed to the next middleware if there are no
    // validation errors
    next();
}

// getAllOrdersValidatorRules - This array of validation rules is used
// to validate the query parameters for requests that retrieve all orders.
// It checks for the existence, non-emptiness, and validity of the "limit"
// and "page" query parameters. The "limit" parameter must be an integer
// between 1 and 100, while the "page" parameter must be a positive integer.
// If any of these conditions are not met, it will return an error message
// indicating that the request information is invalid.
export let getAllOrdersValidatorRules = [
    query("limit")
        .default(10)
        .isInt({ min: 1, max: 100 })
        .withMessage(ERROR_CODES.INVALID_REQUEST_INFO)
        .bail(),
    query("page")
        .default(1)
        .isInt({ min: 1 })
        .withMessage(ERROR_CODES.INVALID_REQUEST_INFO)
        .bail(),
];

// getAllOrdersValidationFunction()
// This function is a middleware that validates the request for 
// retrieving all orders. It verifies if there are invalid "limit"
// or "page" query parameters in the request. If there are validation 
// errors, it will report an invalid request information error, 
// else, it will proceed to the next middleware.
export function getAllOrdersValidationFunction(req, res, next) {
    // get validation errors from the request
    // if any
    const errors = validationResult(req);

    // check if there was invalid limit query
    // in the request body and report an invalid request
    // info error if there was
    if (!errors.isEmpty()) {
        switch (errors.array()[0].path) {
            case "limit":
                return reportInvalidRequestInfoError(
                    next,
                    "Invalid limit query. Limit must be an integer between 1 and 100.",
                );
            case "page":
                return reportInvalidRequestInfoError(
                    next,
                    "Invalid page query. Page must be a positive integer.",
                );
        }
    }

    // proceed to the next middleware if there are no
    // validation errors
    next();
}
