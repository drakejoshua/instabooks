import { frontendLog } from "../../infra/utils/logging/logFunctions.js";

export async function loggerService(log) {
    // use the default logger to log the log data
    frontendLog( log )
}