import { addToCartService } from "./user.service.js"

export async function addToCartController( req, res, next ) {
    let bookId = req.body.book_id
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