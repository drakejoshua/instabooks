import { body, validationResult } from "express-validator";
import { ERROR_CODES, reportInvalidAddressError } from "../shared/utils/errors";

export const createOrderValidatorRules = [
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

export function createOrderValidationFunction(req, res, next) {
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
