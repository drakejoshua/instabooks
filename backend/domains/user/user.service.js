export async function addToCartService( user, bookId, quantity ) {
    await user.addToCart( bookId, quantity )

    return user.cart 
}