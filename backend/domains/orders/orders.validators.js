import { body, validationResult } from "express-validator";
import { ERROR_CODES, reportInvalidAddressError } from "../shared/utils/errors";

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
        let frontendURL = process.env.FRONTEND_URL
        return res.redirect(`${frontendURL}/orders/invalid`)
    }

    // proceed to the next middleware if there are no
    // validation errors
    next();
}