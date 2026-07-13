import Orders from "../../database/models/order.model.js";
import { InvalidAddressError, OrderNotFoundError, PaymentGatewayError } from "../shared/utils/errors.js";
import { paystackInitialize, paystackVerify } from "./orders.utils.js";

export async function checkoutOrderService(shippingAddress, userData) {
    // check if the shipping address is valid
    if ( !userData.addresses.includes(shippingAddress) ) {
        throw InvalidAddressError;
    }

    // get the cart items from the user data
    let cartItems = await userData.getCartData();

    // calculate the total price of the order
    let totalPrice = cartItems.reduce( function( total, item ) {
        return total + (item.price * item.quantity);
    }, 0);

    // create a new order document with the user data 
    // and cart items
    let newOrder = await Orders.create({
        user_id: userData._id,
        shipping_address: shippingAddress,
        price_at_purchase: totalPrice,
        payment_status: "pending",
        status: "pending",
        products: cartItems.map( function( item ) {
            return {
                book_id: item.id,
                order_quantity: item.quantity,
            }
        })
    });

    // generate payment authorization link using
    // paystackInitialize() utility function
    let paymentData = await paystackInitialize(userData, newOrder);

    // check if there was an error initializing the payment
    // and throw a PaymentGatewayError if there was
    if ( paymentData.status === "error" ) {
        PaymentGatewayError.message = paymentData.error.message;
        throw PaymentGatewayError;
    }

    return paymentData.data;
}


export async function confirmOrderPaymentService(reference) {
    // verify the payment using the paystackVerify() 
    // utility function
    let verificationData = await paystackVerify(reference);

    // check if there was an error verifying the payment
    // and throw a PaymentGatewayError if there was
    if ( verificationData.status === "error" ) {
        throw PaymentGatewayError;
    }

    // get the order to confirm from the database using the 
    // reference
    let orderToConfirm = await Orders.findById( reference );

    // check if the order exists and throw an InvalidOrderReferenceError
    // if it doesn't
    if ( !orderToConfirm ) {
        throw OrderNotFoundError;
    }

    // extract the payment status from the verification data
    let paymentStatus = verificationData.data?.data?.status

    // check if the payment status is successful and 
    // update the order status and payment status 
    // accordingly, if not, throw a PaymentGatewayError
    if ( paymentStatus === "success" ) {
        orderToConfirm.status = "shipped";
        orderToConfirm.payment_status = "paid";
    } else {
        orderToConfirm.payment_status = "failed";
    }

    return verificationData.data;
}