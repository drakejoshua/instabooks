import { cloudinaryUpload } from "../../infra/utils/cloudinary.js";
import Books from "../../database/models/book.model.js";
import { BookNotFoundError } from "../shared/utils/errors.js";
import upload from "../../infra/middleware/multer.js";
import { CacheKeys, CacheOperations, CacheUpdate } from "../../cache/utils.js";

export async function addBookService(bookDetails, bookCoverPhoto) {
    // upload the cover photo file to cloudinary and
    // store the upload results
    let uploadResult = await cloudinaryUpload(bookCoverPhoto);

    // create new book in the database using the book
    // details passed as an argument to the function
    // plus the upload data from the cloudinary upload
    let newBook = await Books.create({
        ...bookDetails,
        cover_photo_url: uploadResult.secure_url,
        cover_photo_id: uploadResult.public_id,
    });

    // return newly created book details
    return newBook.getBookDetails();
}

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
        uploadResult = await cloudinaryUpload(updatedbookCoverPhoto);

        bookToUpdate.cover_photo_id = uploadResult.public_id;
        bookToUpdate.cover_photo_url = uploadResult.secure_url;
    }

    // update the book details with the updated book
    // information
    for (property in updatedbookDetails) {
        bookToUpdate.property = updatedbookDetails.property;
    }

    // save the updated book information back to the
    // database
    await bookToUpdate.save();

    // delete former information in the cache in order to
    // trigger new database retrieval maintaining data
    // integrity
    await CacheOperations.deleteCache( 
        req, 
        CacheKeys.bookById( bookToUpdate._id )
    )

    // return updated book information
    return bookToUpdate.getBookDetails();
}



export async function deleteBookService( bookId, req ) {
    // find and delete the book with book id in the 
    // database
    let bookToDelete = await Books.findByIdAndDelete(bookId);

    // check if book was deleted in the database, else,
    // report error stating book was not found
    if (!bookToDelete) {
        throw BookNotFoundError;
    }

    // delete former information in the cache in order to
    // maintain data integrity
    await CacheOperations.deleteCache( 
        req, 
        CacheKeys.bookById( bookToUpdate._id )
    )
}


export async function getBookService( bookId, req ) {
    // get the book details from cache or database
    let book = await CacheOperations.getAndHydrateBookById( bookId, req )
    
    // return a lean version of the book details 
    // from the database
    return book.getBookDetails()
}


export async function getBooksService( limit, req ) {
    // get the books from the database using the 
    // limit specified
    let books = await CacheOperations.getAndHydrateBooks( limit, req )

    // return a lean version of the books details 
    // from the database
    return books.map( book => book.getBookDetails() )
}