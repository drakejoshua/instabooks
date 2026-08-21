import { query, param, body, validationResult } from "express-validator";
import {
    ERROR_CODES,
    reportInvalidAddressError,
    reportInvalidOrderReferenceError,
    reportInvalidRequestInfoError,
} from "../shared/utils/errors.js";

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

export function confirmOrderPaymentValidationFunction(req, res, next) {
    // get validation errors from the request
    // if any
    const errors = validationResult(req);

    // check if there was invalid order reference
    // in the request body and redirect to the
    // frontend invalid order reference page if there
    // was an invalid order reference
    if (!errors.isEmpty()) {
        let frontendURL = process.env.FRONTEND_URL;
        return res.redirect(`${frontendURL}/orders/invalid`);
    }

    // proceed to the next middleware if there are no
    // validation errors
    next();
}

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
