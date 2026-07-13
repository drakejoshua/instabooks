import {
    confirmOrderPaymentService,
    getAllOrdersForAdminService,
    getOrderDetailsService,
} from "./orders.service";

export async function checkoutOrderController(req, res, next) {
    try {
        // get the shipping address from the request body
        let { shipping_address } = req.body;

        // call the create order service to create a
        // new order based on shipping address and user data
        let paymentData = await checkoutOrderService(
            shipping_address,
            req.user,
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

export async function confirmOrderPaymentController(req, res, next) {
    try {
        // get the order reference from the request query
        let { reference } = req.query;

        // call the confirm order payment service to verify
        // the order payment and update the order status
        await confirmOrderPaymentService(reference);

        // redirect to the frontend order confirmation page
        // with the order reference as a route parameter
        let frontendURL = process.env.FRONTEND_URL;
        return res.redirect(`${frontendURL}/orders/confirm/${reference}`);
    } catch (error) {
        next(error);
    }
}

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

export async function getAllOrdersController(req, res, next) {
    try {
        // get the user id from the request user object
        let userId = req.user._id;
        let { limit, page } = req.query;

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

export async function getAllOrdersForAdminController(req, res, next) {
    try {
        let { limit, page } = req.query;

        // call the get all orders service to retrieve all the orders
        // for the user with the specified limit
        let ordersData = await getAllOrdersForAdminService(limit, page);

        // send the orders as a response
        res.json({
            status: "success",
            data: ordersData,
        });
    } catch (error) {
        next(error);
    }
}
