export async function addToCartService( user, bookId, quantity ) {
    await user.addToCart( bookId, quantity )

    return user.cart 
}

export async function deleteFromCartService( user, bookId ) {
    await user.removeFromCart( bookId )

    return user.cart
}

export async function addAddressService( user, newAddress ) {
    await user.addAddress( newAddress )

    return user.addresses
}