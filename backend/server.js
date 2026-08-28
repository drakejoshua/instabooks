import express from "express";
import { connectDB } from "./database/connectDB.js";
import authRouter from "./domains/auth/auth.routes.js";
import usersRouter from "./domains/user/user.routes.js";
import passport from "passport";
import initializePassport from "./infra/middleware/passport.js";
import crypto from "crypto";
import notFound from "./domains/shared/middleware/notFound.js";
import errorHandler from "./domains/shared/middleware/error.js";
import redisClient from "./cache/setup.js";
import bookRouter from "./domains/books/books.routes.js";
import orderRouter from "./domains/orders/orders.routes.js";
import cors from "cors";
import {
    logDebugInfo,
    logRedisConnectionError,
    logRequestCompleted,
    logRequestReceived,
    logServerStarted,
    logUncaughtException,
    logUnhandledRejection,
} from "./infra/utils/logging/logFunctions.js";
import { loggerRouter } from "./domains/logger/logger.routes.js";
import { requestContext } from "./infra/utils/logging/requestContext.js";

const server = express();
const frontendURL = process.env.FRONTEND_URL;

// connect to the database
await connectDB();

// initialize passport
passport.initialize();
initializePassport(passport);

server.use(
    cors({
        origin: frontendURL,
        credentials: true,
    }),
);

// middleware to parse JSON bodies
server.use(express.json());

// midleware to parse urlencoded bodies
server.use(express.urlencoded({ extended: true }));

// middleware to log incoming requests and response times
server.use(function (req, res, next) {
    // create profiler for each request
    const startTime = Date.now();

    // retrieve the request ID from the headers sent by the
    // frontend or generate a new one if not present ( for tracing
    // and debugging purposes )
    const requestId = req.header("x-request-id") || crypto.randomUUID();

    // set the request ID in the response for the frontend to use
    // in subsequent requests
    res.setHeader("X-Request-ID", requestId);

    // store the request ID in the request context for downstream use
    requestContext.run(
        { requestId },
        () => {
            // Log incoming request
            logRequestReceived(req);

            // Log completed request
            res.on("finish", () => {
                logRequestCompleted(req, res, startTime);
            });

            // Continue the middleware chain ONCE
            next();
        }
    );
});

// attach the routes from the auth domains to the server
server.use("/auth", authRouter);

// attach the routes from the user domains to the server
server.use("/user", usersRouter);

// attach the routes from the books domains to the server
server.use("/books", bookRouter);

// attach the routes from the books domains to the server
server.use("/orders", orderRouter);

// attach the logger route to the server
server.use("/logger", loggerRouter);

// not-found/catch-all middleware to handle requests to
// undefined routes
server.use(notFound);

// error handling middleware to catch and log errors
server.use(errorHandler);

// handle and log uncaughtExceptions and unhandledRejections
// to prevent server crashes
process.on("uncaughtException", (err) => {
    logUncaughtException(err);
});
process.on("unhandledRejection", (reason) => {
    logUnhandledRejection(reason);
});

const PORT = process.env.PORT || 8000;

async function startServer() {
    try {
        logDebugInfo(
            `Attempting to connect to Redis at ${process.env.REDIS_URL}`,
        );

        await redisClient.connect();

        server.listen(PORT, () => {
            logServerStarted(PORT);
        });
    } catch (err) {
        logRedisConnectionError(err);

        process.exit(1);
    }
}

startServer();
