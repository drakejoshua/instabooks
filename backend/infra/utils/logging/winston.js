import winston from 'winston';
import {LogtailTransport} from "@logtail/winston"
import {Logtail} from "@logtail/node"

// winston.js - This file contains the configuration for the Winston logger.
// It sets up different logging transports based on the environment (development or production).
// In development, logs are sent to the console, while in production, logs are sent to Logtail.
// The logger is configured to use JSON format for structured logging.

// Logtail instance - This instance of Logtail is created using the 
// Logtail API key from the environment variables.
const logtail = new Logtail( process.env.BETTER_STACK_KEY );

// winston development logger configuration - This configuration sets 
// up the Winston logger for the development environment.
winston.loggers.add("development", {
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
})

// winston production logger configuration - This configuration sets 
// up the Winston logger for the production environment, sending logs to Logtail.
winston.loggers.add("production", {
    level: "info",
    format: winston.format.json(),
    transports: [
        new LogtailTransport(logtail),
    ]
})


export default winston.loggers.get( process.env.NODE_ENV )