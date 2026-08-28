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

BookRouter.get(  // non-auth
    "/search",
    publicBooksLimiter,
    searchBooksValidationRule,
    searchBooksValidationFunction,
    searchBooksController,
);

BookRouter.get(
    "/admin/search",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    searchBooksValidationRule,
    searchBooksValidationFunction,
    searchBooksController,
);


BookRouter.get(
    "/admin/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    bookIdValidationRule,
    bookIdValidationFunction,
    getBookController,
);


BookRouter.get(
    "/admin",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    getBooksValidationRule,
    getBooksValidationFunction,
    getBooksController,
);

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


BookRouter.delete(
    "/:book_id",
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("admin-key", { session: false }),
    bookIdValidationRule,
    bookIdValidationFunction,
    deleteBookController,
);


BookRouter.get( // non-auth
    "/",
    publicBooksLimiter,
    getBooksValidationRule,
    getBooksValidationFunction,
    getBooksController,
);


BookRouter.get( // non-auth
    "/:book_id",
    publicBooksLimiter,
    bookIdValidationRule,
    bookIdValidationFunction,
    getBookController,
);

export default BookRouter;