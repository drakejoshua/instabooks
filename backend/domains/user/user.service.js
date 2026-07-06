// addToCartService()
// This service function adds a book to the user's cart. It takes 
// the user object, book ID, and quantity as parameters, calls the 
// addToCart method on the user object, and returns the updated cart.
export async function addToCartService( user, bookId, quantity ) {
    await user.addToCart( bookId, quantity )

    return user.cart 
}


// deleteFromCartService()
// This service function removes a book from the user's cart. It 
// takes the user object and book ID as parameters, calls the 
// removeFromCart method on the user object, and returns the 
// updated cart.
export async function deleteFromCartService( user, bookId ) {
    await user.removeFromCart( bookId )

    return user.cart
}


// addAddressService()
// This service function adds a new address to the user's account. 
// It takes the user object and the new address as parameters, 
// calls the addAddress method on the user object, and returns the 
// updated list of addresses.
export async function addAddressService( user, newAddress ) {
    await user.addAddress( newAddress )

    return user.addresses
}


// deleteAddressService()
// This service function removes an address from the user's 
// account. It takes the user object and the address to be deleted 
// as parameters, calls the deleteAddress method on the user 
// object, and returns the updated list of addresses.
export async function deleteAddressService( user, newAddress ) {
    await user.deleteAddress( newAddress )

    return user.addresses
}