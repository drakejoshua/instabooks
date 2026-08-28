import { body, validationResult } from 'express-validator';
import { ERROR_CODES, reportInvalidLoggerDataError } from '../shared/utils/errors.js';

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

export function loggerValidatorFunction(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return reportInvalidLoggerDataError(next);
    }

    next();
}