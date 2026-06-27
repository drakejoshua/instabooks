import {
  validationResult,
  header
} from "express-validator";
import {
  ERROR_CODES,
  reportInvalidAuthorizationTokenError
} from "../shared/utils/errors.js";

export let bearerAuthValidationRules = [
    header("Authorization")
        .exists()
        .withMessage(ERROR_CODES.INVALID_AUTHORIZATION_TOKEN)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_AUTHORIZATION_TOKEN)
        .bail()
        .custom(function (value) {
        const token = value.split(" ")[1];

        if (!token) {
            throw new Error();
        }

        return true;
        })
        .withMessage(ERROR_CODES.INVALID_AUTHORIZATION_TOKEN),
];

export function bearerAuthValidationFunction(req, res, next) {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return reportInvalidAuthorizationTokenError(next);
    }

    next();
}
