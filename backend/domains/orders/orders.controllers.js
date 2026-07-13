import { confirmOrderPaymentService } from "./orders.service";

export async function checkoutOrderController(req, res, next) {
    try {
        // get the shipping address from the request body
        let { shipping_address } = req.body;

        // call the create order service to create a
        // new order based on shipping address and user data
        let paymentData = await checkoutOrderService(shipping_address, req.user);

        // send the payment info as a response
        res.status(201).json({ 
            status: "success",
            data: paymentData
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


export async function getOrderController(req, res, next) {
    try {
        // get the user id from the request user object
        let userId = req.user._id;
        let { order_id } = req.params;

        // call the get order service to retrieve the order
        // details for the user
        let order = await getOrderService( userId, order_id );

        // send the order details as a response
        res.json({
            status: "success",
            data: order
        });
    } catch (error) {
        next(error);
    }
}