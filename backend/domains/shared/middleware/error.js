import { ERROR_CODES } from '../utils/errors.js';
import { logServerError } from '../../../infra/utils/logging/logFunctions.js';

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