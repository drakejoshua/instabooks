import { CacheOperations, CacheUpdate } from "../../cache/utils.js";
import Orders from "../../database/models/order.model.js";
import { trackOrderCancellation, trackPurchase } from "../../infra/utils/google analytics/events.js";
import { logOrderCancellation, logOrderCheckout, logOrderPaymentConfirmed, logOrderPaymentFailed, logOrderRevalidation, logOrderRevalidationFailure } from "../../infra/utils/logging/logFunctions.js";
import {
    InvalidAddressError,
    OrderNotFoundError,
    PaymentGatewayError,
} from "../shared/utils/errors.js";
import { paystackInitialize, paystackVerify } from "./orders.utils.js";
import mongoose from "mongoose";


// checkoutOrderService()
// This function is a service that handles the checkout of an order. It receives 
// the shipping address and user data, validates the shipping address, calculates
// the total price of the order, creates a new order document in the database,
// generates a payment authorization link using the paystackInitialize() utility 
// function, clears the user's cart, updates the cache for the user data, and logs
// the order checkout event using the backend logger.
export async function checkoutOrderService(shippingAddress, user, req) {
    // check if the shipping address is valid
    if (!user.addresses.includes(shippingAddress)) {
        throw InvalidAddressError;
    }

    // get the cart items from the user data
    let cartItems = await user.getCartData();

    // calculate the total price of the order
    let totalPrice = cartItems.reduce(function (total, item) {
        return total + ( item.price * item.order_quantity );
    }, 0);

    // create a new order document with the user data
    // and cart items
    let newOrder = await Orders.create({
        user_id: user._id,
        shipping_address: shippingAddress,
        price_at_purchase: totalPrice.toFixed(2),
        payment_status: "pending",
        status: "pending",
        products: cartItems.map(function (item) {
            return {
                book_id: item.id,
                order_quantity: item.order_quantity,
            };
        }),
    });

    // generate payment authorization link using
    // paystackInitialize() utility function
    let paymentData = await paystackInitialize(user, newOrder);

    // check if there was an error initializing the payment
    // and throw a PaymentGatewayError if there was
    if (paymentData.status === "error") {
        PaymentGatewayError.message = paymentData.error.message;

        // delete the order if there was an error initializing 
        // the payment
        await Orders.findByIdAndDelete(newOrder._id);

        throw PaymentGatewayError;
    }

    // clear the user's cart after checkout and save 
    // the user data
    user.cart = []
    await user.save()

    // update the cache for the user data after checkout
    // to ensure that the cart is cleared in the cache 
    // as well
    await CacheUpdate.updateUserById( user, req )

    // log order checkout as info using backend logger
    logOrderCheckout( 
        newOrder._id, 
        newOrder.user_id, 
        newOrder.price_at_purchase
    );

    return paymentData.data;
}

// confirmOrderPaymentService()
// This function is a service that handles the confirmation of an order payment. 
// It receives the order reference and request object, verifies the payment using
// the paystackVerify() utility function, checks if the order exists and has not
// already been confirmed, updates the order status and payment status accordingly,
// updates the store inventory data for each book in the order, sends a purchase 
// event to Google Analytics, and logs the order payment confirmation event using 
// the backend logger.
export async function confirmOrderPaymentService(reference, req) {
    // verify the payment using the paystackVerify()
    // utility function
    let verificationData = await paystackVerify(reference);

    // check if there was an error verifying the payment
    // and throw a PaymentGatewayError if there was
    if (verificationData.status === "error") {
        PaymentGatewayError.message = verificationData.error.message;

        // log order payment failure as error using backend logger
        logOrderPaymentFailed( 
            reference, 
            req.user._id,
            verificationData.error.message || "Payment verification failed"
        );

        throw PaymentGatewayError;
    }

    // get the order to confirm from the database using the
    // reference
    let orderToConfirm = await Orders.findById(reference);

    // check if the order exists and throw an InvalidOrderReferenceError
    // if it doesn't
    if (!orderToConfirm) {
        throw OrderNotFoundError;
    }

    // check if the order has already been confirmed and 
    // and just return the verification data if it has, to avoid
    // double confirmation of the order ( silent confirmation )
    if (
        orderToConfirm.payment_status === "paid" && 
        orderToConfirm.status === "shipped"
    ) {
        // log order payment confirmation as info using backend logger
        logOrderPaymentConfirmed( 
            orderToConfirm._id, 
            orderToConfirm.user_id
        );

        return verificationData.data;
    }

    // extract the payment status from the verification data
    let paymentStatus = verificationData.data?.data?.status;

    // check if the payment status is successful and
    // update the order status, payment status and store inventory data
    // accordingly, if not, throw a PaymentGatewayError
    if (paymentStatus === "success") {
        // update the order status to shipped and payment 
        // status to paid
        orderToConfirm.status = "shipped";
        orderToConfirm.payment_status = "paid";

        // populate the order products with book data to update the store inventory
        await orderToConfirm.populate("products.book_id");

        // update the store inventory data for each book in the order
        for (let item of orderToConfirm.products) {
            let book = await item.book_id;
            book.quantity -= item.order_quantity;
            await book.save();

            await CacheUpdate.updateBookById( book, req )
        }

        // send purchase event to google analytics
        trackPurchase( req.header("x-google-analytics-client-id"), orderToConfirm )

        // log order payment confirmation as info using backend logger
        logOrderPaymentConfirmed( 
            orderToConfirm._id, 
            orderToConfirm.user_id
        );
    } else {
        orderToConfirm.payment_status = "failed";
    }

    // save the updated order to the database
    await orderToConfirm.save(); 

    return verificationData.data;
}

// revalidateOrderPaymentService()
// This function is a service that handles the revalidation of an order payment. 
// It receives the order id and user data, retrieves the existing order from the
// database, duplicates the order to create a new order with a new reference,
// deletes the old order from the database, generates a payment authorization link
// using the paystackInitialize() utility function, and logs the order revalidation
// event using the backend logger.
export async function revalidateOrderPaymentService(orderId, userData) {
    // get the existing order from the database
    let orderToRevalidate = await Orders.findById(orderId);

    // check if the order exists and throw an OrderNotFoundError
    // if it doesn't
    if (!orderToRevalidate) {
        throw OrderNotFoundError;
    }

    // duplicate the order to create a new order with a new reference
    let duplicateOrder = orderToRevalidate.$clone();
    duplicateOrder._id = new mongoose.Types.ObjectId();
    duplicateOrder.isNew = true;
    await duplicateOrder.save()
    
    // delete the old order from the database
    await Orders.findByIdAndDelete(orderId);

    // generate payment authorization link using
    // paystackInitialize() utility function
    let paymentData = await paystackInitialize(userData, duplicateOrder);

    // check if there was an error initializing the payment
    // and throw a PaymentGatewayError if there was
    if (paymentData.status === "error") {
        // log order revalidation failure as error using backend logger
        logOrderRevalidationFailure( 
            duplicateOrder._id, 
            duplicateOrder.user_id,
            paymentData.error.message || "Payment revalidation failed"
        );

        PaymentGatewayError.message = paymentData.error.message;
        throw PaymentGatewayError;
    }

    // log order revalidation as info using backend logger
    logOrderRevalidation( 
        duplicateOrder._id, 
        duplicateOrder.user_id
    );

    return paymentData.data;
}

// cancelOrderService()
// This function is a service that handles the cancellation of an order. 
// It receives the order id and request object, retrieves the existing
// order from the database, updates the order status to cancelled, updates
// the store inventory data for each book in the order, saves the updated
// order to the database, sends an order cancellation event to Google 
// Analytics, and logs the order cancellation event using the backend logger.
export async function cancelOrderService(orderId, req) {
    // get the existing order from the database
    let orderToCancel = await Orders.findById(orderId);

    // check if the order exists and throw an OrderNotFoundError
    // if it doesn't
    if (!orderToCancel) {
        throw OrderNotFoundError;
    }

    // update the order status to cancelled
    orderToCancel.status = "cancelled";

    // populate the order products with book data to 
    // update the store inventory
    await orderToCancel.populate("products.book_id");

    // update the store inventory data for each book in the 
    // cancelled order
    for (let item of orderToCancel.products) {
        let book = await item.book_id;
        book.quantity += item.order_quantity;
        await book.save();
    }

    // save the updated order to the database
    await orderToCancel.save();

    // send order cancellation event to google analytics
    trackOrderCancellation( req.header("x-google-analytics-client-id"), orderToCancel )

    // log order cancellation as info using backend logger
    logOrderCancellation( 
        orderToCancel._id, 
        orderToCancel.user_id
    );
}

// getOrderDetailsService()
// This function is a service that handles the retrieval of order details. 
// It receives the user id and order id, retrieves the existing order from 
// the database, checks if the order exists and belongs to the user, and 
// returns the order details.
export async function getOrderDetailsService(userId, orderId) {
    // find the order by user id and order id
    let order = await Orders.findOne({ _id: orderId, user_id: userId });

    // check if the order exists and throw an OrderNotFoundError
    // if it doesn't
    if (!order) {
        throw OrderNotFoundError;
    }

    return await order.getOrderDetails();
}

// getAllOrdersService()
// This function is a service that handles the retrieval of all orders for a user. 
// It receives the user id, limit, and page, retrieves all the orders for the user 
// from the database with the specified limit and page, counts the total number of 
// orders for the user, and returns the orders and total count.
export async function getAllOrdersService(userId, limit, page) {
    // find all orders for the user with the
    // specified limit
    let orders = await Orders.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .limit(page * limit)
    let totalOrders = await Orders.countDocuments({ user_id: userId });

    return {
        totalOrders,
        orders: await Promise.all( orders.map( (order) => order.getOrderDetails()) ),
    };
}

// getAllOrdersForAdminService()
// This function is a service that handles the retrieval of all orders for an admin. 
// It receives the limit, page, and request object, retrieves all the orders from the 
// database with the specified limit and page, counts the total number of orders, and 
// returns the orders and total count.
export async function getAllOrdersForAdminService(limit, page, req) {
    // find all orders for the user with the
    // specified limit
    let orders = await CacheOperations.getAndHydrateOrders(limit, page, req);
    let totalOrders = await CacheOperations.getTotalOrdersCount( req );

    return {
        totalOrders,
        orders: await Promise.all( orders.map( (order) => order.getOrderDetails()) ),
    };
}
