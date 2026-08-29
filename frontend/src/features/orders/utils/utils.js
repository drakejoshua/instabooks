// calculateCartTotal()
// This function calculates the total price of 
// all the books in the user's cart using the reduce() 
// method. It takes the cart array as an argument and 
// returns the total price
export function calculateCartTotal( cart ) {
    if ( !cart ) return 0

    return cart.reduce(function( total, book ) {
        return total + ( book.price * book.order_quantity )
    }, 0)
}