import { addToCartService, deleteFromCartService } from "./user.service.js"

export async function addToCartController( req, res, next ) {
    let bookId = req.body.book_id || req.params.book_id
    let quantity = req.body.quantity

    try {
        let updatedCart = await addToCartService( req.user, bookId, quantity )

        res.json({
            status: "success",
            data: updatedCart
        })
    } catch( err ) {
        next( err )
    }
}

export async function deleteFromCartController( req, res, next ) {
    let bookId = req.params.book_id

    try {
        let updatedCart = await deleteFromCartService( req.user, bookId )

        res.json({
            status: "success",
            data: updatedCart
        })
    } catch( err ) {
        next( err )
    }
}

export async function addAddressController( req, res, next ) {
    let addressToAdd = req.body.address

    try {
        let updatedAddresses = await addAddressService( req.user, address )

        res.json({
            status: "success",
            data: updatedAddresses
        })
    } catch( err ) {
        next( err )
    }
}

export async function deleteAddressController( req, res, next ) {
    let addressToDelete = req.body.address

    try {
        let updatedAddresses = await deleteAddressService( req.user, address )

        res.json({
            status: "success",
            data: updatedAddresses
        })
    } catch( err ) {
        next( err )
    }
}