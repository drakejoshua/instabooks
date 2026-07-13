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
    checkoutOrderValidatorRules,
    checkoutOrderValidationFunction,
    confirmOrderPaymentValidatorRules,
    confirmOrderPaymentValidationFunction,
    getOrderValidationFunction,
    getOrderValidatorRules,
} from "./orders.validators.js";
import { 
    checkoutOrderController, 
    confirmOrderPaymentController, 
    getOrderController
} from "./orders.controllers.js";

orderRouter.post(
    "/checkout",
    passport.authenticate("jwt", { session: false }),
    checkoutOrderValidatorRules,
    checkoutOrderValidationFunction,
    checkoutOrderController,
);

orderRouter.get(
    "/confirm",
    confirmOrderPaymentValidatorRules,
    confirmOrderPaymentValidationFunction,
    confirmOrderPaymentController,
)

orderRouter.get(
    "/:order_id",
    passport.authenticate("jwt", { session: false }),
    getOrderValidatorRules,
    getOrderValidationFunction,
    getOrderController
);


export default orderRouter;
