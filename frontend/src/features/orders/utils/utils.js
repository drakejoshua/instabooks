export function calculateCartTotal( cart ) {
    if ( !cart ) return 0

    return cart.reduce(function( total, book ) {
        return total + ( book.price * book.order_quantity )
    }, 0)
}