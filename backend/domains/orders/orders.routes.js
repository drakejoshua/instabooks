import express from "express";
import {
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
} from "../shared/shared.validators.js";
import passport from "passport";

let orderRouter = express.Router();

orderRouter.use(
    bearerAuthValidationRules, 
    bearerAuthValidationFunction
);

import {
    createOrderValidatorRules,
    createOrderValidationFunction,
} from "./orders.validators.js";
import { createOrderController } from "./orders.controllers.js";

orderRouter.post(
    "/checkout",
    passport.authenticate("jwt", { session: false }),
    createOrderValidatorRules,
    createOrderValidationFunction,
    createOrderController,
);

export default orderRouter;
