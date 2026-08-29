import { ERROR_CODES } from '../utils/errors.js';
import { logServerError } from '../../../infra/utils/logging/logFunctions.js';

// errorHandler() - This function is a middleware that handles errors in the application.
// It logs the error details and sends an appropriate response to the client.
// If the error has a status code, it uses that status code in the response.
// Otherwise, it defaults to a 500 Internal Server Error status code.
export default function errorHandler( err, req, res, next ) {
    logServerError( err, req );

    if ( err.status ) {
        res.status( err.status ).json({
            status: "error",
            error: {
                message: err.message,
                code: err.code
            }
        })
    } else {
        res.status( 500 ).json({
            status: "error",
            error: {
                message: `A fatal error occurred on the server: ${ err.message }` || "A fatal error occurred on the server.",
                code: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR
            }
        })
    }
}