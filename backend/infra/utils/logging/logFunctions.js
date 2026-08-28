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

export function logRequestReceived( req ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REQUEST_RECEIVED),
        method: req.method,
        url: generateURLFromReq(req),
        path: req.path,
        query: req.query,
    });
}

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

export function logUncaughtException( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.UNCAUGHT_EXCEPTION),
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
    });
}

export function logUnhandledRejection( reason ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.UNHANDLED_REJECTION),
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : null,
        code: reason instanceof Error ? reason.code : null,
    });
}

export function logDebugInfo( message ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.DEBUG_INFO),
        message
    })
}

export function logServerStarted( port ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.SERVER_STARTED),
        message: `Server is running on port ${port}`,
    });
}

export function logRedisConnectionError( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.REDIS_CONNECTION_ERROR),
        message: `Failed to connect to Redis: ${ err.message || "Unknown error" }`,
        stack: err.stack
    })
}

export function logDBConnectionSuccess() {
    logger.info({
        ...createBaseLog(LOG_EVENTS.DB_CONNECTION_SUCCESS),
        message: "Successfully connected to the database.",
    });
}

export function logDBConnectionError( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.DB_CONNECTION_ERROR),
        message: err?.message,
        stack: err?.stack,
        code: err?.code,
    });
}

export function logRedisError( err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.CACHE_ERROR),
        message: `Redis error: ${err?.message || "Unknown error"}`,
        stack: err?.stack,
    });
}

export function logRedisConnect() {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REDIS_CONNECT),
        message: "TCP connection established with Redis."
    });
}

export function logRedisConnectSuccess() {
    logger.info({
        ...createBaseLog(LOG_EVENTS.REDIS_CONNECT_SUCCESS),
        message: `Server successfully connected to redis`
    });
}

export function logCacheHit( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_HIT),
        cacheKey: key
    });
}

export function logCachePendingRequest( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_PEND_REQUEST),
        cacheKey: key,
    });
}

export function logCacheMiss( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_MISS),
        cacheKey: key
    });
}

export function logCacheSet( key, expiration ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_SET),
        cacheKey: key,
        expiration: expiration,
    });
}

export function logCacheError( key, err ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.CACHE_ERROR),
        message: `Cache error: ${err.message || "Unknown error"}`,
        stack: err.stack,
        cacheKey: key,
    });
}

export function logCacheDelete( key ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.CACHE_DELETE),
        cacheKey: key
    });
}

export function logOrderCheckout( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_CHECKOUT),
        orderId,
        userId,
    });
}

export function logOrderPaymentConfirmed( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_PAYMENT_CONFIRMED),
        orderId,
        userId,
    });
}

export function logOrderPaymentFailed( orderId, userId, errorMessage ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.ORDER_PAYMENT_FAILED),
        orderId,
        userId,
        errorMessage,
    });
}

export function logOrderRevalidation( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_REVALIDATION),
        orderId,
        userId,
    });
}

export function logOrderRevalidationFailure( orderId, userId, errorMessage ) {
    logger.error({
        ...createBaseLog(LOG_EVENTS.ORDER_REVALIDATION_FAILURE),
        orderId,
        userId,
        errorMessage,
    });
}

export function logOrderCancellation( orderId, userId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.ORDER_CANCELLATION),
        orderId,
        userId
    });
}

export function logStoreBookAddition( bookId ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.STORE_BOOK_ADDITION),
        bookId
    });
}

export function logStoreBookUpdate( bookId, newQuantity ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.STORE_BOOK_UPDATE),
        bookId,
        newQuantity
    });
}

export function logStoreBookDeletion( book ) {
    logger.info({
        ...createBaseLog(LOG_EVENTS.STORE_BOOK_DELETION),
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price,
    });
}

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

export function logInvalidAnalyticsEvent() {
    logger.warn({
        ...createBaseLog(LOG_EVENTS.INVALID_ANALYTICS_EVENT),
        message: "Invalid analytics event, Google analytics " +
        "expects a non-empty string for the event name and " +
        "an object for the params.",
    })
}

export function logInvalidAnalyticsClientId() {
    logger.warn({
        ...createBaseLog(LOG_EVENTS.INVALID_ANALYTICS_CLIENT_ID),
        message: "Invalid analytics clientId, Google analytics " +
        "expects a non-empty string for the clientId.",
    })
}



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