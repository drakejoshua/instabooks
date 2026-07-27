import { trackEvent } from "./GoogleAnalytics"

// admin book addition
export function trackAdminBookAddition( book ) {
    trackEvent("admin_book_addition", {
        item_id: book.id,
        item_name: book.title,
        price: book.price
    })
}


// admin book deletion
export function trackAdminBookDeletion( book ) {
    trackEvent("admin_book_deletion", {
        item_id: book.id,
        item_name: book.title,
        price: book.price
    })
}


// admin book edit
export function trackAdminBookEdit( book ) {
    trackEvent("admin_book_edit", {
        item_id: book.id,
        item_name: book.title,
        price: book.price
    })
}