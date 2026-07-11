// This file defines a set of error codes and corresponding error
// objects for handling various error scenarios in the application.
// Each error object has a message, a status code, and an associated
// error code. The file also provides utility functions to report these
// errors to the next middleware in the Express.js request-response cycle.

// Define a library of error codes for different error scenarios in the
// application
export const ERROR_CODES = {
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    DB_OPERATION_ERROR: "DB_OPERATION_ERROR",
    ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
    INVALID_AUTH_ID: "INVALID_AUTH_ID",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    BOOK_NOT_FOUND: "BOOK_NOT_FOUND",
    INVALID_AUTHORIZATION_TOKEN: "INVALID_AUTHORIZATION_TOKEN",
    INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
    INVALID_USER_NAME: "INVALID_USER_NAME",
    INVALID_OPERATION: "INVALID_OPERATION",
    INVALID_BOOK_ID: "INVALID_BOOK_ID",
    INVALID_ORDER_QUANTITY: "INVALID_ORDER_QUANTITY",
    INVALID_ADDRESS: "INVALID_ADDRESS",
    INVALID_BOOK_TITLE: "INVALID_BOOK_TITLE",
    INVALID_BOOK_DESCRIPTION: "INVALID_BOOK_DESCRIPTION",
    INVALID_BOOK_PAGES: "INVALID_BOOK_PAGES",
    INVALID_BOOK_AUTHOR: "INVALID_BOOK_AUTHOR",
    INVALID_BOOK_PRICE: "INVALID_BOOK_PRICE",
    INVALID_BOOK_QUANTITY: "INVALID_BOOK_QUANTITY",
    INVALID_BOOK_GENRE: "INVALID_BOOK_GENRE",
    INVALID_BOOK_COVER_PHOTO: "INVALID_BOOK_COVER_PHOTO",
    INVALID_REQUEST_INFO: "INVALID_REQUEST_INFO",
};

export const RouteNotFoundError = new Error(
    "The requested resource was not found.",
);
RouteNotFoundError.code = ERROR_CODES.ROUTE_NOT_FOUND;
RouteNotFoundError.status = 404;

export function reportRouteNotFoundError(next) {
    next(RouteNotFoundError);
}

export const InvalidAuthIdError = new Error(
    "Invalid auth id found in request, Please check auth id and try again",
);
InvalidAuthIdError.code = ERROR_CODES.INVALID_AUTH_ID;
InvalidAuthIdError.status = 400;

export function reportInvalidAuthIdError(next) {
    next(InvalidAuthIdError);
}

export const UserNotFoundError = new Error(
    "No user with the specified auth id was found, Please check auth id and try again",
);
UserNotFoundError.code = ERROR_CODES.USER_NOT_FOUND;
UserNotFoundError.status = 404;

export function reportUserNotFoundError(next) {
    next(UserNotFoundError);
}

export const InvalidAuthorizationTokenError = new Error(
    "Invalid authorization token found in request header, Please check and try again",
);
InvalidAuthorizationTokenError.code = ERROR_CODES.INVALID_AUTHORIZATION_TOKEN;
InvalidAuthorizationTokenError.status = 401;

export function reportInvalidAuthorizationTokenError(next) {
    next(InvalidAuthorizationTokenError);
}

export const fileFilterError = new Error(
    "Invalid File Type encountered during upload.",
);
fileFilterError.status = 400;
fileFilterError.code = ERROR_CODES.INVALID_FILE_TYPE;

export function reportFileFilterError(next) {
    next(fileFilterError);
}

export const InvalidFileTypeError = new Error(
    "Invalid File Type or size encountered during upload.",
);
InvalidFileTypeError.status = 400;
InvalidFileTypeError.code = ERROR_CODES.INVALID_FILE_TYPE;

export function reportInvalidFileTypeError(next) {
    next(InvalidFileTypeError);
}

export const InvalidUsernameError = new Error(
    "Invalid user name encoutered. Name must be at least 3 characters long.",
);
InvalidUsernameError.status = 400;
InvalidUsernameError.code = ERROR_CODES.INVALID_USER_NAME;

export function reportInvalidUsernameError(next) {
    next(InvalidFileTypeError);
}

export const InvalidOperationError = new Error(
    "Invalid operation encountered. Please check and try again.",
);
InvalidOperationError.status = 400;
InvalidOperationError.code = ERROR_CODES.INVALID_OPERATION;

export function reportInvalidOperationError(next) {
    next(InvalidOperationError);
}

export const InvalidBookIdError = new Error(
    "The book id provided is invalid, Please check book id and try again",
);
InvalidBookIdError.status = 400;
InvalidBookIdError.code = ERROR_CODES.INVALID_BOOK_ID;

export function reportInvalidBookIdError(next) {
    next(InvalidBookIdError);
}

export const InvalidOrderQuantityError = new Error(
    "The order quantity is invalid, Please check and try again",
);
InvalidOrderQuantityError.status = 400;
InvalidOrderQuantityError.code = ERROR_CODES.INVALID_ORDER_QUANTITY;

export function reportInvalidOrderQuantityError(next) {
    next(InvalidOrderQuantityError);
}

export const InvalidAddressError = new Error(
    "The provided address is invalid, Please check and try again",
);
InvalidAddressError.status = 400;
InvalidAddressError.code = ERROR_CODES.INVALID_ADDRESS;

export function reportInvalidAddressError(next) {
    next(InvalidAddressError);
}

export const InvalidBookTitleError = new Error(
    "The provided book title is invalid, Please check" +
        " the title and try again",
);
InvalidBookTitleError.status = 400;
InvalidBookTitleError.code = ERROR_CODES.INVALID_BOOK_TITLE;

export function reportInvalidBookTitleError(next) {
    next(InvalidBookTitleError);
}

export const InvalidBookDescriptionError = new Error(
    "The provided book description is invalid, Please check" +
        " the description and try again",
);
InvalidBookDescriptionError.status = 400;
InvalidBookDescriptionError.code = ERROR_CODES.INVALID_BOOK_DESCRIPTION;

export function reportInvalidBookDescriptionError(next) {
    next(InvalidBookDescriptionError);
}

export const InvalidBookPagesError = new Error(
    "The provided book page length is invalid, Please check" +
        " the number of pages and try again",
);
InvalidBookPagesError.status = 400;
InvalidBookPagesError.code = ERROR_CODES.INVALID_BOOK_PAGES;

export function reportInvalidBookPagesError(next) {
    next(InvalidBookPagesError);
}

export const InvalidBookAuthorError = new Error(
    "The provided book author is invalid, Please check" +
        " the author details and try again",
);
InvalidBookAuthorError.status = 400;
InvalidBookAuthorError.code = ERROR_CODES.INVALID_BOOK_AUTHOR;

export function reportInvalidBookAuthorError(next) {
    next(InvalidBookAuthorError);
}

export const InvalidBookPriceError = new Error(
    "The provided book price is invalid, Please check" +
        " the price and try again",
);
InvalidBookPriceError.status = 400;
InvalidBookPriceError.code = ERROR_CODES.INVALID_BOOK_PRICE;

export function reportInvalidBookPriceError(next) {
    next(InvalidBookPriceError);
}

export const InvalidBookQuantityError = new Error(
    "The provided store quantity for the book is invalid, Please check" +
        " the quantity and try again",
);
InvalidBookQuantityError.status = 400;
InvalidBookQuantityError.code = ERROR_CODES.INVALID_BOOK_QUANTITY;

export function reportInvalidBookQuantityError(next) {
    next(InvalidBookQuantityError);
}

export const InvalidBookGenreError = new Error(
    "The provided book genre is invalid, Please check" +
        " the genre and try again",
);
InvalidBookGenreError.status = 400;
InvalidBookGenreError.code = ERROR_CODES.INVALID_BOOK_PRICE;

export function reportInvalidBookGenreError(next) {
    next(InvalidBookGenreError);
}

export const InvalidBookCoverPhotoError = new Error(
    "A cover photo must be provided for a book, Please check" +
        " the cover photo file and try again",
);
InvalidBookCoverPhotoError.status = 400;
InvalidBookCoverPhotoError.code = ERROR_CODES.INVALID_BOOK_COVER_PHOTO;

export function reportInvalidBookCoverPhotoError(next) {
    next(InvalidBookCoverPhotoError);
}

export const BookNotFoundError = new Error(
    "The book with the specified id could not be found, Please check" +
        " the book id and try again",
);
BookNotFoundError.status = 404;
BookNotFoundError.code = ERROR_CODES.BOOK_NOT_FOUND;

export function reportBookNotFoundError(next) {
    next(BookNotFoundError);
}

export const InvalidRequestInfoError = new Error(
    "This request contains invalid information, " +
        " Please check your queries, params or headers and try again",
);
InvalidRequestInfoError.status = 400;
InvalidRequestInfoError.code = ERROR_CODES.INVALID_REQUEST_INFO;

export function reportInvalidRequestInfoError(next, message) {
    InvalidRequestInfoError.message = message
        ? message
        : InvalidRequestInfoError.message;
    next(InvalidRequestInfoError);
}
