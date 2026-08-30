export const LOGGER_LEVELS = {
    INFO: "info",
    WARN: "warn",
    ERROR: "error"
}

// logEvent() is an asynchronous function that logs events 
// to the backend API or console based on the application 
// environment. It takes three parameters: level (the log 
// level), message (the log message), and context (an 
// optional object containing additional context for the 
// log event). The function generates a request ID if one 
// is not provided, constructs a log payload, and sends it 
// to the backend API in production or logs it to the 
// console in development.
export async function logEvent( level, message, context = {} ) {
    // get request id from context or generate a new 
    // one if none is provided
    let requestId = context.requestId || crypto.randomUUID()

    // get timestamp for the log event
    let timestamp = new Date().toISOString()

    // construct log payload
    let logPayload = {
        level,
        timestamp,
        message,
        ...context
    }

    let appEnv = import.meta.env.VITE_APP_ENV

    // check working environment and log to console if in development
    // else, send log payload to backend API if in production
    if ( appEnv === "development" ) {
        switch (logPayload.level) {
            case LOGGER_LEVELS.INFO:
                console.log(`[${logPayload.timestamp}] ${logPayload.level.toUpperCase()}: ${logPayload.message}`);
            break;

            case LOGGER_LEVELS.WARN:
                console.warn(`[${logPayload.timestamp}] ${logPayload.level.toUpperCase()}: ${logPayload.message}`);
            break;

            case LOGGER_LEVELS.ERROR:
                console.error(`[${logPayload.timestamp}] ${logPayload.level.toUpperCase()}: ${logPayload.message}`);
            break;
        }
    } else if ( appEnv === "production" ) {
        try {
            // get backend url from .env variables
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            // send log payload to backend API
            const response = await fetch(`${backendUrl}/logger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': requestId
                },
                body: JSON.stringify({
                    log: logPayload
                })
            });
    
            // check if the response is ok, if not log an 
            // error to the console with the response status text
            if (!response.ok) {
                console.error(`Failed to log event: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error logging event:', error);
        }
    }
}


// logger object provides methods for logging events at 
// different levels (info, warn, error). Each method is 
// asynchronous and calls the logEvent function with the 
// appropriate log level, message, and context. The error 
// method also includes an error object in the context for 
// additional debugging information.
export const logger = {
    info: async function( message, context = {} ) {
        await logEvent( LOGGER_LEVELS.INFO, message, context )
    },
    warn: async function( message, context = {} ) {
        await logEvent( LOGGER_LEVELS.WARN, message, context )
    },
    error: async function( message, error, context = {} ) {
        context.error = error
        await logEvent( LOGGER_LEVELS.ERROR, message, context )
    }
}