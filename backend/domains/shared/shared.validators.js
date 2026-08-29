import { validationResult, header } from "express-validator";
import {
    ERROR_CODES,
    reportInvalidAuthorizationTokenError,
} from "../shared/utils/errors.js";

// bearerAuthValidationRules - This array of validation rules 
// is used to validate the "Authorization" header in requests 
// that require bearer token authentication. It checks for the 
// existence and non-emptiness of the header, ensuring that a
//  valid token is provided. Additionally, it verifies that 
// the token is in the correct format (i.e., "Bearer <token>"). 
// If any of these conditions are not met, it will return an 
// error message indicating that the authorization token is invalid.
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

// bearerAuthValidationFunction() - This function is a 
// middleware that checks for validation errors in the 
// request object after applying the bearerAuthValidationRules.
// If there are any validation errors, it reports an invalid 
// authorization token error. If there are no errors, it proceeds 
// to the next middleware or controller.
export function bearerAuthValidationFunction(req, res, next) {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return reportInvalidAuthorizationTokenError(next);
    }

    next();
}
