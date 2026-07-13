import { body, param, query, validationResult } from "express-validator";
import {
    ERROR_CODES,
    reportInvalidBookAuthorError,
    reportInvalidBookCoverPhotoError,
    reportInvalidBookDescriptionError,
    reportInvalidBookGenreError,
    reportInvalidBookIdError,
    reportInvalidBookPagesError,
    reportInvalidBookPriceError,
    reportInvalidBookQuantityError,
    reportInvalidBookTitleError,
    reportInvalidRequestInfoError,
} from "../shared/utils/errors.js";

export let addBookValidationRules = [
    body("title")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_TITLE)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_TITLE)
        .bail()
        .isLength({ min: 5 })
        .withMessage(ERROR_CODES.INVALID_BOOK_TITLE)
        .bail(),
    body("description")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_DESCRIPTION)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_DESCRIPTION)
        .bail()
        .isLength({ min: 20 })
        .withMessage(ERROR_CODES.INVALID_BOOK_DESCRIPTION)
        .bail(),
    body("pages")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_PAGES)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_PAGES)
        .bail()
        .isInt({ min: 1 })
        .withMessage(ERROR_CODES.INVALID_BOOK_PAGES)
        .bail(),
    body("author")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_AUTHOR)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_AUTHOR)
        .bail()
        .isLength({ min: 3 })
        .withMessage(ERROR_CODES.INVALID_BOOK_AUTHOR)
        .bail(),
    body("price")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_PRICE)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_PRICE)
        .bail()
        .isFloat({ min: 2 })
        .withMessage(ERROR_CODES.INVALID_BOOK_PRICE)
        .bail(),
    body("quantity")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_QUANTITY)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_QUANTITY)
        .bail()
        .isInt({ min: 1 })
        .withMessage(ERROR_CODES.INVALID_BOOK_QUANTITY)
        .bail(),
    body("genre")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_GENRE)
        .bail()
        .isLength({ min: 3 })
        .withMessage(ERROR_CODES.INVALID_BOOK_GENRE)
        .bail(),
    body("photo")
        .custom(function (value, { req }) {
            let coverPhoto = req.file;

            if (!coverPhoto) {
                throw new Error();
            }

            return true;
        })
        .withMessage(ERROR_CODES.INVALID_BOOK_COVER_PHOTO),
];

export function addBookValidationFunction(req, res, next) {
    // get validation errors from request if
    // any
    let errors = validationResult(req);

    // check if any errors were encountered from
    // the validation and report them
    if (!errors.isEmpty()) {
        switch (errors.array()[0].msg) {
            case ERROR_CODES.INVALID_BOOK_TITLE:
                return reportInvalidBookTitleError(next);
            case ERROR_CODES.INVALID_BOOK_DESCRIPTION:
                return reportInvalidBookDescriptionError(next);
            case ERROR_CODES.INVALID_BOOK_PAGES:
                return reportInvalidBookPagesError(next);
            case ERROR_CODES.INVALID_BOOK_AUTHOR:
                return reportInvalidBookAuthorError(next);
            case ERROR_CODES.INVALID_BOOK_PRICE:
                return reportInvalidBookPriceError(next);
            case ERROR_CODES.INVALID_BOOK_QUANTITY:
                return reportInvalidBookQuantityError(next);
            case ERROR_CODES.INVALID_BOOK_GENRE:
                return reportInvalidBookGenreError(next);
            case ERROR_CODES.INVALID_BOOK_COVER_PHOTO:
                return reportInvalidBookCoverPhotoError(next);
        }
    }

    // proceed to the next middleware or request handler
    // since no errors were encountered
    next();
}

export let updateBookValidationRules = [
    body("title")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_TITLE)
        .bail()
        .isLength({ min: 5 })
        .withMessage(ERROR_CODES.INVALID_BOOK_TITLE)
        .bail(),
    body("description")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_DESCRIPTION)
        .bail()
        .isLength({ min: 20 })
        .withMessage(ERROR_CODES.INVALID_BOOK_DESCRIPTION)
        .bail(),
    body("pages")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_PAGES)
        .bail()
        .isInt({ min: 1 })
        .withMessage(ERROR_CODES.INVALID_BOOK_PAGES)
        .bail(),
    body("author")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_AUTHOR)
        .bail()
        .isLength({ min: 3 })
        .withMessage(ERROR_CODES.INVALID_BOOK_AUTHOR)
        .bail(),
    body("price")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_PRICE)
        .bail()
        .isInt({ min: 2 })
        .withMessage(ERROR_CODES.INVALID_BOOK_PRICE)
        .bail(),
    body("quantity")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_QUANTITY)
        .bail()
        .isInt({ min: 1 })
        .withMessage(ERROR_CODES.INVALID_BOOK_QUANTITY)
        .bail(),
    body("genre")
        .optional()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_GENRE)
        .bail()
        .isLength({ min: 3 })
        .withMessage(ERROR_CODES.INVALID_BOOK_GENRE)
        .bail(),
    body("photo")
        .optional()
        .custom(function (value, { req }) {
            let coverPhoto = req.file;

            if (!coverPhoto) {
                throw new Error();
            }

            return true;
        })
        .withMessage(ERROR_CODES.INVALID_BOOK_COVER_PHOTO),
];

export function updateBookValidationFunction(req, res, next) {
    // get validation errors from request if
    // any
    let errors = validationResult(req);

    // check if any errors were encountered from
    // the validation and report them
    if (!errors.isEmpty()) {
        switch (errors.array()[0].msg) {
            case ERROR_CODES.INVALID_BOOK_TITLE:
                return reportInvalidBookTitleError(next);
            case ERROR_CODES.INVALID_BOOK_DESCRIPTION:
                return reportInvalidBookDescriptionError(next);
            case ERROR_CODES.INVALID_BOOK_PAGES:
                return reportInvalidBookPagesError(next);
            case ERROR_CODES.INVALID_BOOK_AUTHOR:
                return reportInvalidBookAuthorError(next);
            case ERROR_CODES.INVALID_BOOK_PRICE:
                return reportInvalidBookPriceError(next);
            case ERROR_CODES.INVALID_BOOK_QUANTITY:
                return reportInvalidBookQuantityError(next);
            case ERROR_CODES.INVALID_BOOK_GENRE:
                return reportInvalidBookGenreError(next);
            case ERROR_CODES.INVALID_BOOK_COVER_PHOTO:
                return reportInvalidBookCoverPhotoError(next);
        }
    }

    // proceed to the next middleware or request handler
    // since no errors were encountered
    next();
}


export let bookIdValidationRule = [
    param("book_id")
        .exists()
        .withMessage(ERROR_CODES.INVALID_BOOK_ID)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_BOOK_ID)
        .bail()
        .isMongoId()
        .withMessage(ERROR_CODES.INVALID_BOOK_ID)
        .bail(),
]

export function bookIdValidationFunction(req, res, next) {
    // get validation errors from request if
    // any
    let errors = validationResult(req);

    // check if any errors were encountered from
    // the validation and report them
    if (!errors.isEmpty()) {
        switch (errors.array()[0].msg) {
            case ERROR_CODES.INVALID_BOOK_ID:
                return reportInvalidBookIdError(next);
        }
    }

    // proceed to the next middleware or request handler
    // since no errors were encountered
    next();
}


export let getBooksValidationRule = [
    query("limit")
        .default( 10 )
        .isInt()
        .withMessage( ERROR_CODES.INVALID_REQUEST_INFO )
        .bail(),
    query("page")
        .default( 1 )
        .isInt()
        .withMessage( ERROR_CODES.INVALID_REQUEST_INFO )
        .bail()
]

export function getBooksValidationFunction( req, res, next ) {
    // get validation errors from request if
    // any
    let errors = validationResult(req);

    // check if any errors were encountered from
    // the validation and report them
    if (!errors.isEmpty()) {
        switch( errors.array()[0].param ) {
            case "limit":
                reportInvalidRequestInfoError(
                    next, 
                    "This request has an invalid limit value."+
                    " The limit value must be a positive integer." 
                );
            case "page":
                reportInvalidRequestInfoError(
                    next, 
                    "This request has an invalid page value."+
                    " The page value must be a positive integer." 
                );
        }
    }

    // proceed to the next middleware or request handler
    // since no errors were encountered
    next();
}


export let searchBooksValidationRule = [
    query("query")
        .exists()
        .withMessage(ERROR_CODES.INVALID_REQUEST_INFO)
        .bail()
        .notEmpty()
        .withMessage(ERROR_CODES.INVALID_REQUEST_INFO)
        .bail()
]


export function searchBooksValidationFunction( req, res, next ) {
    // get validation errors from request if
    // any
    let errors = validationResult(req);

    // check if any errors were encountered from
    // the validation and report them
    if (!errors.isEmpty()) {
        switch( errors.array()[0].param ) {
            case "query":
                reportInvalidRequestInfoError(
                    next, 
                    "This request has an invalid query value."+
                    " The query value must not be empty." 
                );
        }
    }

    // proceed to the next middleware or request handler
    // since no errors were encountered
    next();
}