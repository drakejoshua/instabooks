import { cloudinaryDelete, cloudinaryUpload } from "../../infra/utils/cloudinary.js";
import Books from "../../database/models/book.model.js";
import { BookNotFoundError } from "../shared/utils/errors.js";
import { CacheKeys, CacheOperations, CacheUpdate } from "../../cache/utils.js";
import { logStoreBookAddition, logStoreBookDeletion, logStoreBookUpdate } from "../../infra/utils/logging/logFunctions.js";

// addBookService()
// This service function handles the addition of a new book to the database.
// It uploads the book cover photo to Cloudinary, creates a new book document
// in the database with the provided details and the uploaded photo information,
// logs the addition event, and returns the newly created book details.
export async function addBookService(bookDetails, bookCoverPhoto) {
    // upload the cover photo file to cloudinary and
    // store the upload results
    let uploadResult = await cloudinaryUpload(bookCoverPhoto.buffer);

    // create new book in the database using the book
    // details passed as an argument to the function
    // plus the upload data from the cloudinary upload
    let newBook = await Books.create({
        ...bookDetails,
        cover_photo_url: uploadResult.secure_url,
        cover_photo_id: uploadResult.public_id,
    });

    // log the book addition event as info using backend logger
    logStoreBookAddition( newBook._id )

    // return newly created book details
    return newBook.getBookDetails();
}

// updateBookService()
// This service function handles the update of an existing book's details in the database.
// It checks if the book exists, uploads a new cover photo if provided, updates the book
// document with the new details, logs the update event, and returns the updated book details.
export async function updateBookService(
    bookId,
    updatedbookDetails,
    updatedbookCoverPhoto,
    req,
) {
    // define the upload result variable to be used
    let uploadResult;

    // find the book with book id to be updated in
    // the database
    let bookToUpdate = await Books.findById(bookId);

    // check if book was found in the database, else,
    // report error stating book was not found
    if (!bookToUpdate) {
        throw BookNotFoundError;
    }

    // check if the book cover photo was updated and
    // upload the new cover photo to cloudinary
    if (updatedbookCoverPhoto) {
        // delete previous book cover photo in order
        // to conserve cloud storage space
        await cloudinaryDelete( bookToUpdate.cover_photo_id )

        uploadResult = await cloudinaryUpload(updatedbookCoverPhoto.buffer);

        bookToUpdate.cover_photo_id = uploadResult.public_id;
        bookToUpdate.cover_photo_url = uploadResult.secure_url;
    }

    // update the book details with the updated book
    // information
    for ( let property in updatedbookDetails) {
        bookToUpdate[property] = updatedbookDetails[property];
    }

    // save the updated book information back to the
    // database
    await bookToUpdate.save();

    // delete former information in the cache in order to
    // trigger new database retrieval maintaining data
    // integrity
    await CacheUpdate.updateBookById( 
        bookToUpdate, 
        req
    )

    // log the book update event as info using backend logger
    logStoreBookUpdate( 
        bookToUpdate._id,
        bookToUpdate.quantity
    )

    // return updated book information
    return bookToUpdate.getBookDetails();
}


// deleteBookService()
// This service function handles the deletion of a book from the database.
// It checks if the book exists, deletes the book document, removes the cover
// photo from Cloudinary, clears related cache entries, logs the deletion event,
// and returns nothing.
export async function deleteBookService( bookId, req ) {
    // find and delete the book with book id in the 
    // database
    let bookToDelete = await Books.findByIdAndDelete(bookId);

    // check if book was deleted in the database, else,
    // report error stating book was not found
    if (!bookToDelete) {
        throw BookNotFoundError;
    }

    // delete book image from cloudinary in order to
    // maintain data consistenct
    await cloudinaryDelete( bookToDelete.cover_photo_id )

    // delete former information in the cache in order to
    // maintain data integrity
    await CacheOperations.deleteCache( 
        req, 
        CacheKeys.bookById( bookToDelete._id )
    )

    // log the book deletion event as info using backend logger
    logStoreBookDeletion({
        bookId: bookToDelete._id,
        bookTitle: bookToDelete.title,
        bookAuthor: bookToDelete.author,
        bookPrice: bookToDelete.price,
    })
}


// getBookService()
// This service function handles the retrieval of a single book's details from the database.
// It checks if the book exists, fetches the book document, and returns a lean version of
// the book details.
export async function getBookService( bookId, req ) {
    // get the book details from cache or database using the book id provided
    // ( cache is checked first, if not found, retrieve from database )
    let book = await CacheOperations.getAndHydrateBookById( bookId, req )

    // check if book was found in the database, else,
    // report error stating book was not found
    if ( !book ) {
        throw BookNotFoundError
    }
    
    // return a lean version of the book details 
    // from the database
    return book.getBookDetails()
}


// getBooksService()
// This service function handles the retrieval of a list of books from the database.
// It fetches the books with optional pagination, retrieves the total count of books,
// and returns a lean version of the book details along with the total count.
export async function getBooksService( limit, page, req ) {
    // get the books from the database/cache using the 
    // limit specified and the page number specified
    // ( cache is checked first, if not found, retrieve from database )
    let books = await CacheOperations.getAndHydrateBooks( page * limit, req )
    let totalBooks = await CacheOperations.getTotalBooksCount( req )

    // return a lean version of the books details 
    // from the database
    return {
        books: books.map( book => book.getBookDetails() ),
        totalBooks: totalBooks
    }
}


// searchBooksService()
// This service function handles the search for books in the database or cache.
// It retrieves the search results based on the provided query and returns a lean
// version of the book details for each matching book.
export async function searchBooksService( query, req ) {
    // get the search results from the database/cache using the
    // search query provided ( try to retrieve from cache first, 
    // if not found, retrieve from database )
    let searchResults = await CacheOperations.getAndHydrateSearchResults( query, req )

    // return a lean version of the search results from the database/cache
    // by mapping over the search results and calling getBookDetails() on each book
    return searchResults.map( book => book.getBookDetails() )
}