import Orders from "../../database/models/order.model.js";
import { InvalidAddressError } from "../shared/utils/errors.js";
import { paystackInitialize } from "./orders.utils.js";

export async function createOrderService(shippingAddress, userData) {
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

    // check if payment initialization was successful
    if ( paymentData.status === "error" ) {
        throw new Error(paymentData.error.message);
    }

    return paymentData.data;
}
