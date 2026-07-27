import { trackEvent } from "./GoogleAnalytics"

// admin book addition
export function trackAdminBookAddition( book ) {
    trackEvent("admin_book_addition", {
        currency: book.currency || "USD",
        value: book.price,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: 1
            }
        ]
    })
}


// admin book deletion
export function trackAdminBookDeletion( book ) {
    trackEvent("admin_book_deletion", {
        currency: book.currency || "USD",
        value: book.price,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: 1
            }
        ]
    })
}


// admin book edit
export function trackAdminBookEdit( book ) {
    trackEvent("admin_book_edit", {
        currency: book.currency || "USD",
        value: book.price,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: 1
            }
        ]
    })
}