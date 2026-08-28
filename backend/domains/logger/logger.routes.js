import express from "express";
import { loggerValidationRules, loggerValidatorFunction } from "./logger.validator.js";
import { loggerController } from "./logger.controller.js";

export const loggerRouter = express.Router();

loggerRouter.post("/", 
    loggerValidationRules,
    loggerValidatorFunction,
    loggerController
)