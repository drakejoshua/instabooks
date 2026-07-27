import { trackEvent } from "./GoogleAnalytics";

// search
export function trackSearch( searchTerm ) {
    trackEvent("search", {
        search_term: searchTerm
    })
}

// book view
export function trackBookView( book ) {
    trackEvent("view_item", {
        currency: book.currency || "USD",
        value: book.price,
        items: [
            {
                item_id: book.id,
                item_name: book.title,
                price: book.price
            }
        ]
    } )
}