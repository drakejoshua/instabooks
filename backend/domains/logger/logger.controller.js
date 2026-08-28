import { reportInvalidLoggerDataError } from "../shared/utils/errors.js";
import { loggerService } from "./logger.service.js";

const ALLOWED_LOG_LEVELS = ["info", "warn", "error"];

export async function loggerController(req, res, next) {
    // get the log data from the request body
    const { log } = req.body || {};

    // validate the required parameters on the 
    // log data

    // check if log data is provided in the request body
    if ( !log ) {
        return reportInvalidLoggerDataError(next);
    }

    // validate the event of the log from the 
    // log data
    if ( !log.event ) {
        return reportInvalidLoggerDataError(next);
    }

    // validate the timestamp of the log from the 
    // log data
    if ( !log.timestamp ) {
        return reportInvalidLoggerDataError(next);
    }

    // validate the level of the log from the 
    // log data
    if ( !ALLOWED_LOG_LEVELS.includes(log.level) ) {
        return reportInvalidLoggerDataError(next);
    }

    // call the logger service to process the log data
    // and send the appropriate response back to the client
    await loggerService( log );
    res.status(202).send()
}