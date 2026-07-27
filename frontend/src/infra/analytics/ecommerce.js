import { trackEvent } from "./GoogleAnalytics"

// add to cart event
export function trackAddToCart( book ) {
    trackEvent("add_to_cart", {
        currency: book.currency || "USD",
        value: book.price * (book.quantity || 1),
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        ]
    } )
}

// remove from cart event
export function trackRemoveFromCart( book ) {
    trackEvent("remove_from_cart", {
        currency: book.currency || "USD",
        value: book.price * (book.quantity || 1),
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        ]
    } )
}

// view cart event
export function trackViewCart( cart ) {
    trackEvent("view_cart", {
        currency: cart.currency || "USD",
        value: cart.total,
        items: cart.items.map( function(book) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        } )
    } )
}

// checkout
export function trackCheckout( cart ) {
    trackEvent("begin_checkout", {
        currency: cart.currency || "USD",
        value: cart.total,
        coupon: cart.coupon || null,
        items: cart.items.map( function(book) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        } )
    } )
}

// add shipping info
export function trackAddShippingInfo( cart ) {
    trackEvent("add_shipping_info", {
        currency: cart.currency || "USD",
        value: cart.total,
        shipping_tier: "Free Standard Shipping",
        coupon: cart.coupon || null,
        items: cart.items.map( function(book) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        } )
    } )
}

// order confirmation
export function trackOrderConfirmation( order ) {
    trackEvent("purchase", {
        transaction_id: order.id,
        value: order.total,
        currency: order.currency || "USD",
        shipping: 0.00,
        coupon: order.coupon || null,
        items: order.items.map( function(book) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        } )
    } )
}

// order cancellation
export function trackOrderCancellation( order ) {
    trackEvent("order_cancellation", {
        transaction_id: order.id,
        value: order.total,
        currency: order.currency || "USD",
        shipping: 0.00,
        coupon: order.coupon || null,
        items: order.items.map( function(book) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity || 1
            }
        } )
    } )
}