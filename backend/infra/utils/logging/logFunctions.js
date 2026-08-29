import generateURLFromReq from "../../../domains/shared/utils/generateURLFromReq.js"
import logger from "./winston.js"
import { getRequestId } from "./requestContext.js"

export const LOG_EVENTS = {
    // request and response events
    REQUEST_RECEIVED: "request_received",
    REQUEST_COMPLETED: "request_completed",
    UNCAUGHT_EXCEPTION: "uncaught_exception",
    UNHANDLED_REJECTION: "unhandled_rejection",
    DEBUG_INFO: "debug_info",
    SERVER_STARTED: "server_started",

    // database and cache events
    REDIS_CONNECTION_ERROR: "redis_connection_error",
    REDIS_CONNECT_SUCCESS: "redis_connect_success",
    REDIS_CONNECT: "redis_connect",
    DB_CONNECTION_SUCCESS: "db_connection_success",
    DB_CONNECTION_ERROR: "db_connection_error",
    CACHE_HIT: "cache_hit",
    CACHE_PEND_REQUEST: "cache_pend_request",
    CACHE_MISS: "cache_miss",
    CACHE_SET: "cache_set",
    CACHE_ERROR: "cache_error",
    CACHE_DELETE: "cache_delete",

    // order events
    ORDER_CHECKOUT: "order_checkout",
    ORDER_PAYMENT_CONFIRMED: "order_payment_confirmed",
    ORDER_PAYMENT_FAILED: "order_payment_failed",
    ORDER_REVALIDATION_FAILURE: "order_revalidation_failure",
    ORDER_CANCELLATION: "order_cancellation",

    // store events
    STORE_BOOK_ADDITION: "store_book_addition",
    STORE_BOOK_UPDATE: "store_book_update",
    STORE_BOOK_DELETION: "store_book_deletion",

    // server events
    SERVER_ERROR: "server_error",

    // google analytics warnings and errors
    INVALID_ANALYTICS_EVENT: "invalid_analytics_event",
    INVALID_ANALYTICS_CLIENT_ID: "invalid_analytics_client_id",
    GOOGLE_ANALYTICS_ERROR: "google_analytics_error"
}

// createBaseLog() - This function creates a base log object 
// with common properties for logging events. It takes an event 
// name as an argument and returns an object containing the event 
// name, request ID, service name, layer, and timestamp. The 
// request ID is obtained from the request context using the 
// getRequestId() function.
function createBaseLog( event ) {
    const requestId = getRequestId()

    return {
        event,
        requestId,
        service: "instabooks-backend",
        layer: "backend",
        timestamp: new Date().toISOString()
    }
}

// logGoogleAnalyticsError() - This function logs an error related to Google Analytics.
// It takes an error object, event name, and parameters as arguments and logs the 
// error message, stack trace, error code, event name, and parameters using the 
// logger.error() method. The log entry also includes common properties such as 
// request ID, service name, layer, and timestamp.
export function logRequestReceived( req ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REQUEST_RECEIVED),
        method: req.method,
        url: generateURLFromReq(req),
        path: req.path,
        query: req.query,
    });
}

// logRequestCompleted() - This function logs the completion of a request.
// It takes the request object, response object, and start time as arguments and 
// logs the request method, URL, path, query parameters, response status code, 
// and duration in milliseconds using the logger.info() method. The log entry 
// also includes common properties such as request ID, service name, layer, and timestamp.
export function logRequestCompleted( req, res, startTime ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REQUEST_COMPLETED),
        url: generateURLFromReq(req),
        method: req.method,
        statusCode: res.statusCode,
        durationMs: Date.now() - startTime,
        path: req.path,
        query: req.query,
    });
}

// logUncaughtException() - This function logs an uncaught exception that occurs in the application.
// It takes an error object as an argument and logs the error message, stack trace, 
// and error code using the logger.error() method. The log entry also includes 
// common properties such as request ID, service name, layer, and timestamp.
export function logUncaughtException( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.UNCAUGHT_EXCEPTION),
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
    });
}

// logUnhandledRejection() - This function logs an unhandled promise rejection that occurs in the application.
// It takes a reason (error or value) as an argument and logs the message, stack trace, 
// and error code (if available) using the logger.error() method. The log entry also 
// includes common properties such as request ID, service name, layer, and timestamp.
export function logUnhandledRejection( reason ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.UNHANDLED_REJECTION),
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : null,
        code: reason instanceof Error ? reason.code : null,
    });
}

// logDebugInfo() - This function logs debug information for the application.
// It takes a message as an argument and logs it using the logger.info() method. 
// The log entry also includes common properties such as request ID, service name, 
// layer, and timestamp.
export function logDebugInfo( message ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.DEBUG_INFO),
        message
    })
}

// logServerStarted() - This function logs a message indicating that the 
// server has started and is running on a specific port. It takes the port 
// number as an argument and logs it using the logger.info() method.
export function logServerStarted( port ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.SERVER_STARTED),
        message: `Server is running on port ${port}`,
    });
}

// logRedisConnectionError() - This function logs an error that occurs when
// attempting to connect to Redis. It takes an error object as an argument 
// and logs the error message and stack trace using the logger.error() method.
export function logRedisConnectionError( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.REDIS_CONNECTION_ERROR),
        message: `Failed to connect to Redis: ${ err.message || "Unknown error" }`,
        stack: err.stack
    })
}

// logRedisConnectSuccess() - This function logs a message indicating that
// the server has successfully connected to Redis. It uses the logger.info() 
// method to log the message.
export function logDBConnectionSuccess() {
    logger.info({
        ...createBaseLog(LOG_EVENTS.DB_CONNECTION_SUCCESS),
        message: "Successfully connected to the database.",
    });
}

// logDBConnectionError() - This function logs an error that occurs when
// attempting to connect to the database. It takes an error object as an 
// argument and logs the error message, stack trace, and error code using 
// the logger.error() method.
export function logDBConnectionError( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.DB_CONNECTION_ERROR),
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
    });
}

// logRedisConnectionError() - This function logs an error that occurs when
// attempting to connect to Redis. It takes an error object as an argument 
// and logs the error message and stack trace using the logger.error() method.
export function logRedisError( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.CACHE_ERROR),
        message: `Redis error: ${err?.message || "Unknown error"}`,
        stack: err?.stack,
    });
}

// logRedisConnect() - This function logs a message indicating that a TCP
// connection has been established with Redis. It uses the logger.info() 
// method to log the message.
export function logRedisConnect() {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REDIS_CONNECT),
        message: "TCP connection established with Redis."
    });
}

// logRedisConnectSuccess() - This function logs a message indicating that
// the server has successfully connected to Redis. It uses the logger.info() 
// method to log the message.
export function logRedisConnectSuccess() {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REDIS_CONNECT_SUCCESS),
        message: `Server successfully connected to redis`
    });
}

// logCacheHit() - This function logs a cache hit event, indicating that a requested
// item was found in the cache. It takes a cache key as an argument and logs it 
// using the logger.info() method.
export function logCacheHit( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_HIT),
        cacheKey: key
    });
}

// logCachePendingRequest() - This function logs a cache pending request event, 
// indicating that a request for a cache item is currently being processed. 
// It takes a cache key as an argument and logs it using the logger.info() method.
export function logCachePendingRequest( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_PEND_REQUEST),
        cacheKey: key,
    });
}

// logCacheMiss() - This function logs a cache miss event, indicating that a requested
// item was not found in the cache. It takes a cache key as an argument and logs it 
// using the logger.info() method.
export function logCacheMiss( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_MISS),
        cacheKey: key
    });
}

// logCacheSet() - This function logs a cache set event, indicating that an item has
// been added to the cache. It takes a cache key and expiration time as arguments 
// and logs them using the logger.info() method.
export function logCacheSet( key, expiration ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_SET),
        cacheKey: key,
        expiration: expiration,
    });
}

// logCacheError() - This function logs a cache error event, indicating that an error
// occurred while interacting with the cache. It takes a cache key and an error 
// object as arguments and logs them using the logger.error() method.
export function logCacheError( key, err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.CACHE_ERROR),
        message: `Cache error: ${err.message || "Unknown error"}`,
        stack: err.stack,
        cacheKey: key,
    });
}

// logCacheDelete() - This function logs a cache delete event, indicating that an item
// has been removed from the cache. It takes a cache key as an argument and logs it 
// using the logger.info() method.
export function logCacheDelete( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_DELETE),
        cacheKey: key
    });
}

// logOrderCheckout() - This function logs an order checkout event, indicating that a user
// has initiated the checkout process for an order. It takes an order ID and user ID 
// as arguments and logs them using the logger.info() method.
export function logOrderCheckout( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_CHECKOUT),
        orderId,
        userId,
    });
}

// logOrderPaymentConfirmed() - This function logs an order payment confirmed event, 
// indicating that a user's payment for an order has been successfully processed. 
// It takes an order ID and user ID as arguments and logs them using the logger.info() method.
export function logOrderPaymentConfirmed( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_PAYMENT_CONFIRMED),
        orderId,
        userId,
    });
}

// logOrderPaymentFailed() - This function logs an order payment failed event,
// indicating that a user's payment for an order has failed. It takes an order ID, 
// user ID, and error message as arguments and logs them using the logger.error() method.
export function logOrderPaymentFailed( orderId, userId, errorMessage ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.ORDER_PAYMENT_FAILED),
        orderId,
        userId,
        errorMessage,
    });
}

// logOrderRevalidation() - This function logs an order revalidation event, 
// indicating that a user's order payment is being revalidated. It takes an 
// order ID and user ID as arguments and logs them using the logger.info() method.
export function logOrderRevalidation( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_REVALIDATION),
        orderId,
        userId,
    });
}

// logOrderRevalidationFailure() - This function logs an order revalidation failure event,
// indicating that a user's order payment revalidation has failed. It takes an 
// order ID, user ID, and error message as arguments and logs them using the logger.error() method.
export function logOrderRevalidationFailure( orderId, userId, errorMessage ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.ORDER_REVALIDATION_FAILURE),
        orderId,
        userId,
        errorMessage,
    });
}

// logOrderCancellation() - This function logs an order cancellation event,
// indicating that a user's order has been cancelled. It takes an order ID and 
// user ID as arguments and logs them using the logger.info() method.
export function logOrderCancellation( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_CANCELLATION),
        orderId,
        userId
    });
}

// logStoreBookAddition() - This function logs a store book addition event,
// indicating that a new book has been added to the store. It takes a book ID 
// as an argument and logs it using the logger.info() method.
export function logStoreBookAddition( bookId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.STORE_BOOK_ADDITION),
        bookId
    });
}

// logStoreBookUpdate() - This function logs a store book update event,
// indicating that an existing book's details have been updated in the store. 
// It takes a book ID and new quantity as arguments and logs them using the logger.info() method.
export function logStoreBookUpdate( bookId, newQuantity ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.STORE_BOOK_UPDATE),
        bookId,
        newQuantity
    });
}

// logStoreBookDeletion() - This function logs a store book deletion event,
// indicating that a book has been removed from the store. It takes a book object 
// as an argument and logs its ID, title, author, and price using the logger.info() method.
export function logStoreBookDeletion( book ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.STORE_BOOK_DELETION),
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price,
    });
}

// logServerError() - This function logs a server error event, indicating that 
// a fatal error has occurred on the server.
// It takes an error object and the request object as arguments and logs the error 
// message, stack trace, error code, request URL, and request method using the logger.error() method.
export function logServerError( err, req ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.SERVER_ERROR),
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
        url: generateURLFromReq(req),
        method: req.method
    })
}

// logGoogleAnalyticsError() - This function logs an error related to Google Analytics.
// It takes an error object, event name, and parameters as arguments and logs the 
// error message, stack trace, error code, event name, and parameters using the 
// logger.error() method. The log entry also includes common properties such as 
// request ID, service name, layer, and timestamp.
export function logGoogleAnalyticsError( err, event, params ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.GOOGLE_ANALYTICS_ERROR),
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
        event,
        params
    })
}

// logInvalidAnalyticsEvent() - This function logs a warning indicating that an 
// invalid analytics event was encountered.
// It uses the logger.warn() method to log a message explaining that Google Analytics
// expects a non-empty string for the event name and an object for the parameters.
export function logInvalidAnalyticsEvent() {
    logger.warn({
        ...createBaseLog(LOG_EVENTS.INVALID_ANALYTICS_EVENT),
        message: "Invalid analytics event, Google analytics " +
        "expects a non-empty string for the event name and " +
        "an object for the params.",
    })
}

// logInvalidAnalyticsClientId() - This function logs a warning indicating that an 
// invalid analytics client ID was encountered. It uses the logger.warn() method 
// to log a message explaining that Google Analytics expects a non-empty string 
// for the client ID.
export function logInvalidAnalyticsClientId() {
    logger.warn({
        ...createBaseLog(LOG_EVENTS.INVALID_ANALYTICS_CLIENT_ID),
        message: "Invalid analytics clientId, Google analytics " +
        "expects a non-empty string for the clientId.",
    })
}


// frontendLog() - This function logs events from the frontend of the application.
// It takes a logData object as an argument, which should contain the event name,
// log level (info, warn, error), and any additional data to be logged. The function
// constructs a log object with common properties such as request ID, service name,
// layer, and timestamp, and logs it using the appropriate logger method based on the log level.
export function frontendLog( logData ) {
    let logObject = {
        ...logData,
        event: logData.event,
        requestId: getRequestId(),
        service: "instabooks-web-frontend",
        layer: "frontend",
        timestamp: logData.timestamp || new Date().toISOString()
    }
    
    switch ( logData.level ) {
        case "info":
            logger.info(logObject);
        break;

        case "warn":
            logger.warn(logObject);
        break;

        case "error":
            logger.error(logObject);
        break;
    }
}