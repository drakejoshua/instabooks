// import service functions for user related routes
import { 
    addAddressService, 
    addToCartService, 
    deleteAddressService, 
    deleteFromCartService 
} from "./user.service.js"



// addToCartController() 
// This controller handles the request to add a book to the 
// user's cart. It extracts the book ID and quantity from the 
// request, calls the addToCartService, and sends back the 
// updated cart in the response. If an error occurs, it passes the 
// error to the next middleware for handling.
export async function addToCartController( req, res, next ) {
    // extract book_id and quantity from the request body or params
    let bookId = req.body.book_id || req.params.book_id
    let quantity = req.body.quantity

    try {
        // call the service function to add the book to the user's 
        // cart and send success response with the updated cart
        let updatedCart = await addToCartService( req.user, bookId, quantity, req )

        res.json({
            status: "success",
            data: updatedCart
        })
    } catch( err ) {
        // if an error occurs, pass it to the next middleware for 
        // handling
        next( err )
    }
}


// deleteFromCartController()
// This controller handles the request to remove a book from the 
// user's cart. It extracts the book ID from the request params,
// calls the deleteFromCartService, and sends back the updated
// cart in the response. If an error occurs, it passes the error 
// to the next middleware for handling.
export async function deleteFromCartController( req, res, next ) {
    // extract book_id from the request params
    let bookId = req.params.book_id

    try {
        // call the service function to remove the book from the user's
        // cart and send success response with the updated cart
        let updatedCart = await deleteFromCartService( req.user, bookId, req )

        res.json({
            status: "success",
            data: updatedCart
        })
    } catch( err ) {
        // if an error occurs, pass it to the next middleware for 
        // handling
        next( err )
    }
}


// addAddressController()
// This controller handles the request to add a new address to the 
// user's account. It extracts the address from the request body,
// calls the addAddressService, and sends back the updated list of
// addresses in the response. If an error occurs, it passes the 
// error to the next middleware for handling.
export async function addAddressController( req, res, next ) {
    // extract the address from the request body
    let addressToAdd = req.body.address


    try {
        // call the service function to add the address to the 
        // user's account and send success response with the updated 
        // list of addresses
        let updatedAddresses = await addAddressService( req.user, addressToAdd, req )

        res.json({
            status: "success",
            data: updatedAddresses
        })
    } catch( err ) {
        // if an error occurs, pass it to the next middleware for 
        // handling
        next( err )
    }
}


// deleteAddressController()
// This controller handles the request to delete an address from 
// the user's account. It extracts the address from the request
// body, calls the deleteAddressService, and sends back the updated
// list of addresses in the response. If an error occurs, it passes 
// the error to the next middleware for handling.
export async function deleteAddressController( req, res, next ) {
    // extract the address to delete from the request body
    let addressToDelete = req.body.address

    try {
        // call the service function to delete the address from the
        // user's account and send success response with the updated 
        // list of addresses
        let updatedAddresses = await deleteAddressService( req.user, addressToDelete, req )

        res.json({
            status: "success",
            data: updatedAddresses
        })
    } catch( err ) {
        // if an error occurs, pass it to the next middleware for 
        // handling
        next( err )
    }
}