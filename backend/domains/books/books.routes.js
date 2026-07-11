// import express for creating router to
// use on the server
import express from "express";
import {
    addBookValidationFunction,
    addBookValidationRules,
    bookIdValidationFunction,
    bookIdValidationRule,
    deleteBookValidationFunction,
    deleteBookValidationRules,
    getBooksValidationFunction,
    getBooksValidationRule,
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
    updateBookController,
} from "./books.controllers.js";
import bookModel from "../../database/models/book.model.js";

const BookRouter = express.Router();

BookRouter.use(
    bearerAuthValidationRules,
    bearerAuthValidationFunction,
    passport.authenticate("jwt", { session: false }),
);

BookRouter.post(
    "/",
    upload.single("photo"),
    addBookValidationRules,
    addBookValidationFunction,
    addBookController,
);

BookRouter.put(
    "/:book_id",
    upload.single("photo"),
    bookIdValidationRule,
    bookIdValidationFunction,
    updateBookValidationRules,
    updateBookValidationFunction,
    updateBookController,
);


BookRouter.delete(
    "/:book_id",
    bookIdValidationRule,
    bookIdValidationFunction,
    deleteBookController,
);


BookRouter.get(
    "/:book_id",
    bookIdValidationRule,
    bookIdValidationFunction,
    getBookController,
);


BookRouter.get(
    "/",
    getBooksValidationRule,
    getBooksValidationFunction,
    getBooksController,
);

export default BookRouter;
