import {
    addBookService,
    deleteBookService,
    getBookService,
    getBooksService,
    searchBooksService,
    updateBookService,
} from "./books.services.js";

// addBookController()
// This controller handles the addition of a new book to the database.
// It extracts the book details and cover photo from the request,
// invokes the addBookService to process the data, and returns the
// newly added book details in the response.
export async function addBookController(req, res, next) {
    try {
        // extract new book details from the request
        let bookDetails = req.body || {};
        let bookCoverPhoto = req.file;

        // invoke the addBookService to add the new book 
        // to the database and return the newly added book details
        let newBookDetails = await addBookService(
            bookDetails,
            bookCoverPhoto,
            req,
        );

        // return the newly added book details in the response 
        // with a 201 status code
        res.status(201).json({
            status: "success",
            data: newBookDetails,
        });
    } catch (err) {
        next(err);
    }
}

// updateBookController()
// This controller handles the update of an existing book's details.
// It extracts the book ID, updated details, and cover photo from the request,
// invokes the updateBookService to process the updates, and returns the
// updated book details in the response.
export async function updateBookController(req, res, next) {
    try {
        // extract book ID, updated details, and cover photo from the request
        let bookId = req.params.book_id;
        let updatedBookDetails = req.body;
        let updatedBookCoverPhotoFile = req.file || null;

        // invoke the updateBookService to update the book details in the database
        // and return the updated book details
        let updatedBook = await updateBookService(
            bookId,
            updatedBookDetails,
            updatedBookCoverPhotoFile,
            req,
        );

        // return the updated book details in the response
        res.json({
            status: "success",
            data: updatedBook,
        });
    } catch (err) {
        next(err);
    }
}

// deleteBookController()
// This controller handles the deletion of a book from the database.
// It extracts the book ID from the request parameters, invokes the
// deleteBookService to remove the book, and returns a 204 No Content
// status code upon successful deletion.
export async function deleteBookController(req, res, next) {
    try {
        // extract the book ID from the request parameters
        let bookId = req.params.book_id;

        // invoke the deleteBookService to remove the book from the database
        await deleteBookService(bookId, req);

        // return a 204 No Content status code to indicate successful deletion
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

// getBookController()
// This controller handles the retrieval of a single book's details.
// It extracts the book ID from the request parameters, invokes the
// getBookService to fetch the book details, and returns the details
// in the response.
export async function getBookController(req, res, next) {
    try {
        // extract the book ID from the request parameters
        let bookId = req.params.book_id;

        // invoke the getBookService to fetch the book details from the database
        const bookDetails = await getBookService(bookId, req);

        // return the book details in the response
        res.json({
            status: "success",
            data: bookDetails,
        });
    } catch (err) {
        next(err);
    }
}

// getBooksController()
// This controller handles the retrieval of multiple books' details.
// It extracts pagination parameters from the request query, invokes the
// getBooksService to fetch the books, and returns the details in the response.
export async function getBooksController(req, res, next) {
    try {
        // extract pagination parameters from the request query
        let fetchLimit = req.query.limit || 10;
        let fetchPage = req.query.page || 1;

        // invoke the getBooksService to fetch the books from the database
        const bookData = await getBooksService(fetchLimit, fetchPage, req);

        // return the books' details in the response
        res.json({
            status: "success",
            data: bookData,
        });
    } catch (err) {
        next(err);
    }
}

export async function searchBooksController(req, res, next) {
    try {
        // extract the search query from the request
        // query parameters
        let searchQuery = req.query.query || "";

        // search for books in the database/cache using the
        // search query provided
        let searchResults = await searchBooksService(searchQuery, req);

        // return the search results in the response
        res.json({
            status: "success",
            data: searchResults,
        });
    } catch (err) {
        next(err);
    }
}
