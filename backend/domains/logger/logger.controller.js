import { reportInvalidLoggerDataError } from "../shared/utils/errors.js";
import { loggerService } from "./logger.service.js";

// define the allowed log levels for the logger
const ALLOWED_LOG_LEVELS = ["info", "warn", "error"];

// loggerController()
// This function is a controller that handles the logging of events
// in the application. It validates the log data received in the 
// request body and calls the logger service to process the log data.
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