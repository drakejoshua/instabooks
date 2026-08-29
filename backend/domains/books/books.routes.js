// import express for creating router to
// use on the server
import express from "express";
import {
    addBookValidationFunction,
    addBookValidationRules,
    bookIdValidationFunction,
    bookIdValidationRule,
    getBooksValidationFunction,
    getBooksValidationRule,
    searchBooksValidationFunction,
    searchBooksValidationRule,
    updateBookValidationFunction,
    updateBookValidationRules,
} from "./books.validators.js";
import {
    bearerAuthValidationFunction,
    bearerAuthValidationRules,
} from "../shared/shared.validators.js";
import passport from "passport";
import upload from "../../infra/middleware/multer.js";
import {
    addBookController,
    deleteBookController,
    getBookController,
    getBooksController,
    searchBooksController,
    updateBookController,
} from "./books.controllers.js";
import { publicBooksLimiter } from "./books.middleware.js";


const BookRouter = express.Router();

// GET /books/search - search for books based on a query string. 
// This route is publicly accessible and rate-limited to prevent abuse.
BookRouter.get(  // public
    "/search",
    publicBooksLimiter,
    searchBooksValidationRule,
    searchBooksValidationFunction,
    searchBooksController,
);

// GET /books/admin/search - search for books based on a query string.
// This route is protected and requires dummy admin authentication using
// the admin key. It is intended for authenticated use and is not rate-limited.
BookRouter.get(
    "/admin/search",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    searchBooksValidationRule,
    searchBooksValidationFunction,
    searchBooksController,
);

// GET /books/admin/:book_id - retrieve details of a specific book by its ID.
// This route is protected and requires dummy admin authentication using
// the admin key. It is intended for authenticated use and is not rate-limited.
BookRouter.get(
    "/admin/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    bookIdValidationRule,
    bookIdValidationFunction,
    getBookController,
);

// GET /books/admin - retrieve a list of books with optional pagination.
// This route is protected and requires dummy admin authentication using
// the admin key. It is intended for authenticated use and is not rate-limited.
BookRouter.get(
    "/admin",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    getBooksValidationRule,
    getBooksValidationFunction,
    getBooksController,
);

// POST /books - add a new book to the collection. This route is protected and requires
// dummy admin authentication using the admin key. It is intended for authenticated use
// and is not rate-limited. The request can include a photo file for the book cover.
BookRouter.post(
    "/",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    upload.single("photo"),
    addBookValidationRules,
    addBookValidationFunction,
    addBookController,
);

// PUT /books/:book_id - update the details of an existing book by its ID. This route 
// is protected and requires dummy admin authentication using the admin key. It is intended for
// authenticated use and is not rate-limited. The request can include a photo file for the book cover.
BookRouter.put(
    "/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    upload.single("photo"),
    bookIdValidationRule,
    bookIdValidationFunction,
    updateBookValidationRules,
    updateBookValidationFunction,
    updateBookController,
);

// DELETE /books/:book_id - delete an existing book by its ID. This route is protected and requires
// dummy admin authentication using the admin key. It is intended for authenticated use and is not rate-limited.
BookRouter.delete(
    "/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    bookIdValidationRule,
    bookIdValidationFunction,
    deleteBookController,
);

// GET /books - retrieve a list of books with optional pagination. This route is publicly accessible
// and rate-limited to prevent abuse.
BookRouter.get( // public
    "/",
    publicBooksLimiter,
    getBooksValidationRule,
    getBooksValidationFunction,
    getBooksController,
);

// GET /books/:book_id - retrieve details of a specific book by its ID. This route is publicly accessible
// and rate-limited to prevent abuse.
BookRouter.get( // public
    "/:book_id",
    publicBooksLimiter,
    bookIdValidationRule,
    bookIdValidationFunction,
    getBookController,
);

export default BookRouter;