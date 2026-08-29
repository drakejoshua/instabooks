import { body, validationResult } from 'express-validator';
import { ERROR_CODES, reportInvalidLoggerDataError } from '../shared/utils/errors.js';

// loggerValidationRules
// This array defines the validation rules for the logger endpoint.
export const loggerValidationRules = [
    body("log")
        .exists()
        .withMessage(ERROR_CODES.INVALID_LOGGER_DATA)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_LOGGER_DATA)
        .bail()
        .isObject()
        .withMessage(ERROR_CODES.INVALID_LOGGER_DATA)
        .bail()
]

// loggerValidatorFunction()
// This function is a middleware that checks for validation errors
// in the request object after applying the loggerValidationRules.
export function loggerValidatorFunction(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return reportInvalidLoggerDataError(next);
    }

    next();
}