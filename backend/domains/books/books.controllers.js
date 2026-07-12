import { addBookService, deleteBookService, getBookService, getBooksService, updateBookService } from "./books.services.js"

export async function addBookController( req, res, next ) {
    try {
        // extract new book details from the request
        let bookDetails = req.body || {}
        let bookCoverPhoto = req.file

        let newBookDetails = await addBookService( 
            bookDetails, 
            bookCoverPhoto,
            req
        )

        res.status(201).json({
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
            updatedBookCoverPhotoFile,
            req
        )

        res.json({
            status: "success",
            data: updatedBook
        })
    } catch( err ) {
        next( err )
    }
}


export async function deleteBookController( req, res, next ) {
    try {
        let bookId = req.params.book_id

        await deleteBookService( bookId, req )

        res.status( 204 ).send()
    } catch( err ) {
        next( err )
    }
}


export async function getBookController( req, res, next ) {
    try {
        let bookId = req.params.book_id

        const bookDetails = await getBookService( bookId, req )

        res.json({
            status: "success",
            data: bookDetails
        })
    } catch( err ) {
        next( err )
    }
}


export async function getBooksController( req, res, next ) {
    try {
        let fetchLimit = req.query.limit || 10

        const books = await getBooksService( fetchLimit, req )

        res.json({
            status: "success",
            data: books
        })
    } catch( err ) {
        next( err )
    }
}