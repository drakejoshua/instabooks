import { addBookService, updateBookService } from "./books.services.js"

export async function addBookController( req, res, next ) {
    try {
        // extract new book details from the request
        let bookDetails = req.body || {}
        let bookCoverPhoto = req.file

        let newBookDetails = await addBookService( 
            bookDetails, 
            bookCoverPhoto
        )

        res.json({
            status: "success",
            data: newBookDetails
        })
    } catch( err ) {
        next( err )
    }
}


export async function updateBookController( req, res, next ) {
    try {
        let bookId = req.params.book_id
        let updatedBookDetails = req.body
        let updatedBookCoverPhotoFile = req.file || null

        let updatedBook = await updateBookService(
            bookId,
            updatedBookDetails,
            updatedBookCoverPhotoFile
        )

        res.json({
            status: "success",
            data: updatedBook
        })
    } catch( err ) {
        next( err )
    }
}