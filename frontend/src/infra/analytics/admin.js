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
export function trackAdminBookUpdate( book ) {
    trackEvent("admin_book_update", {
        item_id: book.id,
        item_name: book.title,
        price: book.price
    })
}


// admin book list view
export function trackAdminBookListView( books ) {
    trackEvent("admin_book_list_view", {
        items: books.map( function( book ) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price
            }
        })
    })
}


// admin book view
export function trackAdminBookView( book ) {
    trackEvent("admin_book_view", {
        item_id: book.id,
        item_name: book.title,
        price: book.price
    })
}


// admin book search
export function trackAdminBookSearch( searchTerm ) {
    trackEvent("admin_book_search", {
        search_term: searchTerm
    })
}