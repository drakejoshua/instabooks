export const LOGGER_LEVELS = {
    INFO: "info",
    WARN: "warn",
    ERROR: "error"
}

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
            const response = await fetch('/logger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': requestId
                },
                body: JSON.stringify({
                    log: logPayload
                })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to log event: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error logging event:', error);
        }
    }
}

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