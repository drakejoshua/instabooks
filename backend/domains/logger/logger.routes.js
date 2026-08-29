import express from "express";
import { loggerValidationRules, loggerValidatorFunction } from "./logger.validator.js";
import { loggerController } from "./logger.controller.js";

export const loggerRouter = express.Router();

// POST /logger
// This route handles the logging of events in the application.
// It applies validation rules and a validator function to ensure
// that the log data received in the request body is valid before
// passing it to the logger controller for processing.
loggerRouter.post("/", 
    loggerValidationRules,
    loggerValidatorFunction,
    loggerController
)