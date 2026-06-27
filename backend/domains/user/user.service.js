export async function addToCartService( user, bookId, quantity ) {
    await user.addToCart( bookId, quantity )

    return user.cart 
}

export async function removeFromCartService( user, bookId ) {
    await user.removeFromCart( bookId )

    return user.cart
}