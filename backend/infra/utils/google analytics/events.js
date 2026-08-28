import { trackServerEvent } from "./google-analytics.js"

// add to cart event
export function trackAddToCart( clientId, book, quantity ) {
    trackServerEvent(clientId, "add_to_cart", {
        currency: book.currency || "USD",
        value: book.price * quantity,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: quantity || 1
            }
        ]
    })
}


// remove from cart event
export function trackRemoveFromCart( clientId, book ) {
    trackServerEvent(clientId, "remove_from_cart", {
        currency: book.currency || "USD",
        value: book.price,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.order_quantity || 1
            }
        ]
    })
}


// purchase event
export function trackPurchase( clientId, order ) {
    trackServerEvent(clientId, "purchase", {
        currency: order.currency || "USD",
        value: order.price_at_purchase,
        transaction_id: order._id,
        items: order.products.map( function(book) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.order_quantity
            }
        })
    })
}


// order cancellation event
export function trackOrderCancellation( clientId, order ) {
    trackServerEvent(clientId, "order_cancellation", {
        currency: order.currency || "USD",
        value: order.price_at_purchase,
        transaction_id: order._id
    })
}