import { trackEvent } from "./GoogleAnalytics";

// search
export function trackSearch(searchTerm) {
    trackEvent("search", {
        search_term: searchTerm,
    });
}

// book view
export function trackBookView(book) {
    trackEvent("view_item", {
        currency: book.currency || "USD",
        value: book.price,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity,
            },
        ],
    });
}

// book items list view
export function trackBookListingsView(books, page = "home") {
    trackEvent("view_item_list", {
        item_list_id: `${page} book`,
        item_list_name: `${page} book`,
        items: books.map( function( book ) {
            return {
                item_id: book.id,
                item_name: book.title,
                price: book.price,
                quantity: book.quantity,
            }
        })
    });
}
