import express from "express";
import {
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
} from "../shared/shared.validators.js";
import passport from "passport";

let orderRouter = express.Router();

orderRouter.use(bearerAuthValidationRules, bearerAuthValidationFunction);

import {
    checkoutOrderValidatorRules,
    checkoutOrderValidationFunction,
    confirmOrderPaymentValidatorRules,
    confirmOrderPaymentValidationFunction,
    getOrderDetailsValidatorRules,
    getOrderDetailsValidationFunction,
    getAllOrdersValidatorRules,
    getAllOrdersValidationFunction,
} from "./orders.validators.js";
import {
    checkoutOrderController,
    confirmOrderPaymentController,
    getOrderDetailsController,
    getAllOrdersController,
    getAllOrdersForAdminController,
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
);

orderRouter.get(
    "/:order_id",
    passport.authenticate("jwt", { session: false }),
    getOrderDetailsValidatorRules,
    getOrderDetailsValidationFunction,
    getOrderDetailsController,
);

orderRouter.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    getAllOrdersValidatorRules,
    getAllOrdersValidationFunction,
    getAllOrdersController,
);

orderRouter.get(
    "/admin",
    passport.authenticate("admin-key", { session: false }),
    getAllOrdersValidatorRules,
    getAllOrdersValidationFunction,
    getAllOrdersForAdminController,
);

export default orderRouter;
