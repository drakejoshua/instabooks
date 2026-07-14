import Orders from "../../database/models/order.model.js";
import {
    InvalidAddressError,
    OrderNotFoundError,
    PaymentGatewayError,
} from "../shared/utils/errors.js";
import { paystackInitialize, paystackVerify } from "./orders.utils.js";

export async function checkoutOrderService(shippingAddress, user) {
    // check if the shipping address is valid
    if (!user.addresses.includes(shippingAddress)) {
        throw InvalidAddressError;
    }

    // get the cart items from the user data
    let cartItems = await user.getCartData();

    // calculate the total price of the order
    let totalPrice = cartItems.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);

    // create a new order document with the user data
    // and cart items
    let newOrder = await Orders.create({
        user_id: user._id,
        shipping_address: shippingAddress,
        price_at_purchase: totalPrice,
        payment_status: "pending",
        status: "pending",
        products: cartItems.map(function (item) {
            return {
                book_id: item.id,
                order_quantity: item.quantity,
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

    return paymentData.data;
}

export async function confirmOrderPaymentService(reference) {
    // verify the payment using the paystackVerify()
    // utility function
    let verificationData = await paystackVerify(reference);

    // check if there was an error verifying the payment
    // and throw a PaymentGatewayError if there was
    if (verificationData.status === "error") {
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

    // extract the payment status from the verification data
    let paymentStatus = verificationData.data?.data?.status;

    // check if the payment status is successful and
    // update the order status and payment status
    // accordingly, if not, throw a PaymentGatewayError
    if (paymentStatus === "success") {
        orderToConfirm.status = "shipped";
        orderToConfirm.payment_status = "paid";
    } else {
        orderToConfirm.payment_status = "failed";
    }

    return verificationData.data;
}

export async function getOrderDetailsService(userId, orderId) {
    // find the order by user id and order id
    let order = await Orders.findOne({ _id: orderId, user_id: userId });

    // check if the order exists and throw an OrderNotFoundError
    // if it doesn't
    if (!order) {
        throw OrderNotFoundError;
    }

    return order;
}

export async function getAllOrdersService(userId, limit, page) {
    // find all orders for the user with the
    // specified limit
    let orders = await Orders.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(page && page > 0 ? (page - 1) * limit : 0);
    let totalOrders = await Orders.countDocuments({ user_id: userId });

    return {
        totalOrders,
        orders,
    };
}

export async function getAllOrdersForAdminService(limit, page, req) {
    // find all orders for the user with the
    // specified limit
    let orders = await CacheOperations.getAndHydrateOrders(limit, page, req);
    let totalOrders = await CacheOperations.getTotalOrdersCount( req );

    return {
        totalOrders,
        orders,
    };
}
