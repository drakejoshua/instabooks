import { frontendLog } from "../../infra/utils/logging/logFunctions.js";

// loggerService()
// This function is a service that handles the logging of events
// in the application. It receives the log data and uses the 
// default logger to log the data.
export async function loggerService(log) {
    // use the default logger to log the log data
    frontendLog( log )
}