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
    bearerAuthValidationFunction
);

BookRouter.post(
    "/",
    passport.authenticate("admin-key", { session: false }),
    upload.single("photo"),
    addBookValidationRules,
    addBookValidationFunction,
    addBookController,
);

BookRouter.put(
    "/:book_id",
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
    passport.authenticate("admin-key", { session: false }),
    bookIdValidationRule,
    bookIdValidationFunction,
    deleteBookController,
);


BookRouter.get(
    "/:book_id",
    passport.authenticate("jwt", { session: false }),
    bookIdValidationRule,
    bookIdValidationFunction,
    getBookController,
);


BookRouter.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    getBooksValidationRule,
    getBooksValidationFunction,
    getBooksController,
);

export default BookRouter;
