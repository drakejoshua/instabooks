import { trackEvent } from "./GoogleAnalytics"

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

// begin checkout
export function trackBeginCheckout( cart ) {
    trackEvent("begin_checkout", {
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