export async function createOrderController(req, res, next) {
    try {
        // get the shipping address from the request body
        let { shipping_address } = req.body;

        // call the create order service to create a
        // new order based on shipping address and user data
        let paymentData = await createOrderService(shipping_address, req.user);

        // send the payment info as a response
        res.status(201).json({ 
            status: "success",
            data: paymentData
        });
    } catch (error) {
        next(error);
    }
}
