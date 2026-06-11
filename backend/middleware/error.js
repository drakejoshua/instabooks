import logger from '../utils/winston.js';
import generateURLFromReq from '../utils/generateURLFromReq.js';

export default function errorHandler( err, req, res, next ) {
    logger.error({
        event: 'error_occurred',
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
        url: generateURLFromReq(req),
        method: req.method
    })

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
                code: err.code || "SERVER_ERROR"
            }
        })
    }
}