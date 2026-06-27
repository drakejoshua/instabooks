import { addToCartService } from "./user.service.js"

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

export async function removeFromCartController( req, res, next ) {
    let bookId = req.params.book_id

    try {
        let updatedCart = await removeFromCartService( req.user, bookId )

        res.json({
            status: "success",
            data: updatedCart
        })
    } catch( err ) {
        next( err )
    }
}