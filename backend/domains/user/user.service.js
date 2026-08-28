import { CacheOperations, CacheUpdate } from "../../cache/utils.js"
import { trackAddToCart, trackRemoveFromCart } from "../../infra/utils/google analytics/events.js"



// addToCartService()
// This service function adds a book to the user's cart. It takes 
// the user object, book ID, and quantity as parameters, calls the 
// addToCart method on the user object, and returns the updated cart.
export async function addToCartService( user, bookId, quantity, req = null ) {
    await user.addToCart( bookId, quantity )

    // update user data in cache to maintain data 
    // consistency
    await CacheUpdate.updateUserById( user, req )

    let cartData = await user.getCartData()

    // send add to cart event to google analytics
    trackAddToCart( 
        req.header("x-google-analytics-client-id"),
        cartData[0], 
        quantity 
    )

    return cartData
}


// deleteFromCartService()
// This service function removes a book from the user's cart. It 
// takes the user object and book ID as parameters, calls the 
// removeFromCart method on the user object, and returns the 
// updated cart.
export async function deleteFromCartService( user, bookId, req ) {
    const deletedItem = await user.removeFromCart( bookId )

    // update user data in cache to maintain data 
    // consistency
    await CacheUpdate.updateUserById( user, req )

    // send remove from cart event to google analytics
    trackRemoveFromCart( 
        req.header("x-google-analytics-client-id"),
        deletedItem 
    )

    return user.getCartData()
}


// addAddressService()
// This service function adds a new address to the user's account. 
// It takes the user object and the new address as parameters, 
// calls the addAddress method on the user object, and returns the 
// updated list of addresses.
export async function addAddressService( user, newAddress, req ) {
    await user.addAddress( newAddress )

    // update user data in cache to maintain data 
    // consistency
    await CacheUpdate.updateUserById( user, req )

    return user.addresses
}


// deleteAddressService()
// This service function removes an address from the user's 
// account. It takes the user object and the address to be deleted 
// as parameters, calls the deleteAddress method on the user 
// object, and returns the updated list of addresses.
export async function deleteAddressService( user, addressToDelete, req ) {
    await user.deleteAddress( addressToDelete )

    // update user data in cache to maintain data 
    // consistency
    await CacheUpdate.updateUserById( user, req )

    return user.addresses
}