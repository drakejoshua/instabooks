import express from "express";
import {
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
} from "../shared/shared.validators.js";
import passport from "passport";

import {
    checkoutOrderValidatorRules,
    checkoutOrderValidationFunction,
    confirmOrderPaymentValidatorRules,
    confirmOrderPaymentValidationFunction,
    orderIdValidatorRules,
    orderIdValidationFunction,
    getAllOrdersValidatorRules,
    getAllOrdersValidationFunction,
} from "./orders.validators.js";
import {
    checkoutOrderController,
    confirmOrderPaymentController,
    getOrderDetailsController,
    getAllOrdersController,
    getAllOrdersForAdminController,
    revalidateOrderPaymentController,
    cancelOrderController,
} from "./orders.controllers.js";


let orderRouter = express.Router();

// GET /orders/confirm
// This route handles the confirmation of an order payment. It
// acts as a callback route for the payment gateway to redirect to after
// the payment is completed. It applies validation rules and a validator 
// function to ensure that the order reference received in the request query
// It applies validation rules and a validator function to ensure
// that the order reference received in the request query is valid before
// passing it to the confirm order payment controller for processing.
orderRouter.get(
    "/confirm",
    confirmOrderPaymentValidatorRules,
    confirmOrderPaymentValidationFunction,
    confirmOrderPaymentController,
);

// [!]: All routes below this line require bearer authentication. 
// The bearer token is expected to be sent in the Authorization 
// header of the request. The token is validated using the 
// bearerAuthValidationRules and bearerAuthValidationFunction 
// middleware functions. If the token is valid, the request is 
// allowed to proceed to the respective controller function for 
// processing. If the token is invalid or missing, an error 
// response is sent back to the client.
orderRouter.use(bearerAuthValidationRules, bearerAuthValidationFunction);

// POST /orders/checkout
// This route handles the checkout of an order. It applies validation rules 
// and a validator function to ensure that the shipping address received in 
// the request body is valid before passing it to the checkout order controller 
// for processing.
orderRouter.post(
    "/checkout",
    passport.authenticate("jwt", { session: false }),
    checkoutOrderValidatorRules,
    checkoutOrderValidationFunction,
    checkoutOrderController,
);

// GET /orders/
// This route handles the retrieval of all orders for a user. It applies 
// validation rules and a validator function to ensure that the request is 
// valid before passing it to the get all orders controller for processing.
orderRouter.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    getAllOrdersValidatorRules,
    getAllOrdersValidationFunction,
    getAllOrdersController,
);

// GET /orders/admin
// This route handles the retrieval of all orders for an admin. It applies 
// validation rules and a validator function to ensure that the request is 
// valid before passing it to the get all orders for admin controller for processing.
orderRouter.get(
    "/admin",
    passport.authenticate("admin-key", { session: false }),
    getAllOrdersValidatorRules,
    getAllOrdersValidationFunction,
    getAllOrdersForAdminController,
);

// GET /orders/revalidate/:order_id
// This route handles the revalidation of an order payment. It applies 
// validation rules and a validator function to ensure that the order id 
// received in the request params is valid before passing it to the 
// revalidate order payment controller for processing.
orderRouter.get(
    "/revalidate/:order_id",
    passport.authenticate("jwt", { session: false }),
    orderIdValidatorRules,
    orderIdValidationFunction,
    revalidateOrderPaymentController,
)

// GET /orders/:order_id
// This route handles the retrieval of order details. It applies 
// validation rules and a validator function to ensure that the 
// order id received in the request params is valid before passing 
// it to the get order details controller for processing.
orderRouter.get(
    "/:order_id",
    passport.authenticate("jwt", { session: false }),
    orderIdValidatorRules,
    orderIdValidationFunction,
    getOrderDetailsController,
);

// DELETE /orders/:order_id
// This route handles the cancellation of an order. It applies 
// validation rules and a validator function to ensure that the order id 
// received in the request params is valid before passing it to the 
// cancel order controller for processing.
orderRouter.delete(
    "/:order_id",
    passport.authenticate("jwt", { session: false }),
    orderIdValidatorRules,
    orderIdValidationFunction,
    cancelOrderController,
);

export default orderRouter;
