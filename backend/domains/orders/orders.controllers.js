import {
    confirmOrderPaymentService,
    getAllOrdersForAdminService,
    getOrderDetailsService,
    checkoutOrderService,
    getAllOrdersService,
    cancelOrderService,
    revalidateOrderPaymentService
} from "./orders.service.js";


// checkoutOrderController()
// This function is a controller that handles the checkout of an order.
// It receives the shipping address from the request body and calls the
// checkout order service to create a new order and retrieve payment data.
// Payment data in this context refers to the payment information required 
// to complete the order checkout process and redirect the user to the 
// payment gateway for payment processing.
export async function checkoutOrderController(req, res, next) {
    try {
        // get the shipping address from the request body
        let { shipping_address } = req.body;

        // call the create order service to create a
        // new order based on shipping address and user data
        let paymentData = await checkoutOrderService(
            shipping_address,
            req.user,
            req
        );

        // send the payment info as a response
        res.status(201).json({
            status: "success",
            data: paymentData,
        });
    } catch (error) {
        next(error);
    }
}

// confirmOrderPaymentController()
// This function is a controller that handles the confirmation of an order payment.
// It receives the order reference from the request query and calls the confirm order 
// payment service to verify the order payment and update the order status.
// The order reference is the same thing as th order id from mongoDB. Once an order is
// confirmed, the order status is updated to "shipped" as no admin confirmation is 
// required for the order to be shipped( This is a dummy implementation ) and 
// the user is redirected to the frontend order confirmation page with the order 
// reference as a route parameter.
export async function confirmOrderPaymentController(req, res, next) {
    try {
        // get the order reference from the request query
        let { reference } = req.query;

        // call the confirm order payment service to verify
        // the order payment and update the order status
        await confirmOrderPaymentService(reference, req);

        // redirect to the frontend order confirmation page
        // with the order reference as a route parameter
        let frontendURL = process.env.FRONTEND_URL;
        return res.redirect(`${frontendURL}/orders/details/${reference}`);
    } catch (error) {
        next(error);
    }
}

// getOrderDetailsController()
// This function is a controller that handles the retrieval of order details.
// It receives the order id from the request params and calls the get order 
// service to retrieve the order details for the user. The order details are 
// then sent as a response to the client.
export async function getOrderDetailsController(req, res, next) {
    try {
        // get the user id from the request user object
        let userId = req.user._id;
        let { order_id } = req.params;

        // call the get order service to retrieve the order
        // details for the user
        let order = await getOrderDetailsService(userId, order_id);

        // send the order details as a response
        res.json({
            status: "success",
            data: order,
        });
    } catch (error) {
        next(error);
    }
}

// getAllOrdersController()
// This function is a controller that handles the retrieval of all orders for a user.
// It receives the user id from the request user object and calls the get all orders 
// service to retrieve all the orders for the user. The orders are then sent as a 
// response to the client.
export async function getAllOrdersController(req, res, next) {
    try {
        // get the user id from the request user object
        let userId = req.user._id;
        let limit = req.query.limit || 10
        let page = req.query.page || 1

        // call the get all orders service to retrieve all the orders
        // for the user with the specified limit
        let ordersData = await getAllOrdersService(userId, limit, page);

        // send the orders as a response
        res.json({
            status: "success",
            data: ordersData,
        });
    } catch (error) {
        next(error);
    }
}

// getAllOrdersForAdminController()
// This function is a controller that handles the retrieval of all orders for an admin.
// It receives the limit and page from the request query and calls the get all orders 
// for admin service to retrieve all the orders for the admin. The orders are then sent 
// as a response to the client.
export async function getAllOrdersForAdminController(req, res, next) {
    try {
        let limit = req.query.limit || 10
        let page = req.query.page || 1

        // call the get all orders service to retrieve all the orders
        // for the user with the specified limit
        let ordersData = await getAllOrdersForAdminService(limit, page, req);

        // send the orders as a response
        res.json({
            status: "success",
            data: ordersData,
        });
    } catch (error) {
        next(error);
    }
}

// revalidateOrderPaymentController()
// This function is a controller that handles the revalidation of an order payment.
// It receives the order id from the request params and calls the revalidate order 
// payment service to verify the order payment and update the order status. The 
// verification data is then sent as a response to the client.
export async function revalidateOrderPaymentController(req, res, next) {
    try {
        // get the order id from the request params
        let { order_id } = req.params;

        // call the confirm order payment service to verify
        // the order payment and update the order status
        let verificationData = await revalidateOrderPaymentService(order_id, req.user);

        // send the verification data as a response
        res.json({
            status: "success",
            data: verificationData,
        });
    } catch (error) {
        next(error);
    } 
}
    
// cancelOrderController()
// This function is a controller that handles the cancellation of an order.
// It receives the order id from the request params and calls the cancel order 
// service to cancel the order. A success message is then sent as a response 
// to the client.
export async function cancelOrderController(req, res, next) {
    try {
        // get the user id from the request user object
        let userId = req.user._id;
        let { order_id } = req.params;

        // call the cancel order service to cancel the order
        await cancelOrderService(order_id, req);

        // send a success response
        res.json({
            status: "success",
            message: "Order cancelled successfully",
        });
    } catch (error) {
        next(error);
    }
}