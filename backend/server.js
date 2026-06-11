import express from 'express';
import { connectDB } from './database/connectDB.js';
import authRouter from './domains/auth/auth.routes.js';
import passport from 'passport';
import initializePassport from './middleware/passport.js';
import logger from './utils/winston.js';
import crypto from 'crypto';
import generateURLFromReq from './utils/generateURLFromReq.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error.js';


const server = express();

// connect to the database
await connectDB();

// initialize passport
passport.initialize();
initializePassport( passport );

// middleware to parse JSON bodies
server.use( express.json() );

// midleware to parse urlencoded bodies
server.use( express.urlencoded({ extended: true }) );


// middleware to log incoming requests and response times
server.use( function(req, res, next) {
    // create profiler for each request
    const startTime = Date.now();

    // generate a unique request ID for tracing
    const requestId = crypto.randomUUID();

    // log the incoming request
    logger.info({
        event: "request_received",
        method: req.method,
        url: generateURLFromReq(req),
        requestId: requestId,
        path: req.path,
        query: req.query
    })

    // attach request ID to request object for downstream use
    req.requestId = requestId;

    // attach a listener to log the response time when the response is finished
    res.on('finish', () => {
        logger.info({
            event: 'request_completed',
            url: generateURLFromReq(req),
            method: req.method,
            statusCode: res.statusCode,
            durationMs: Date.now() - startTime,
            requestId: req.requestId,
            path: req.path,
            query: req.query
        });
    });

    // proceed to the next middleware or route handler
    next();
} )


server.use("/auth", authRouter );


// not-found/catch-all middleware to handle requests to 
// undefined routes
server.use( notFound )

// error handling middleware to catch and log errors
server.use( errorHandler )

// handle and log uncaughtExceptions and unhandledRejections 
// to prevent server crashes
process.on('uncaughtException', (err) => {
    logger.error({
        event: 'uncaught_exception',
        message: err?.message,
        stack: err?.stack,
        code: err?.code
    })
})
process.on('unhandledRejection', (reason, promise) => {
    logger.error({
        event: 'unhandled_rejection',
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : null,
        code: reason instanceof Error ? reason.code : null
    })
})


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    logger.info({
        event: "server_started",
        message: `Server is running on port ${ PORT }`
    })
});