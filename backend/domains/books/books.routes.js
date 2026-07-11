// import express for creating router to
// use on the server
import express from "express";
import {
    addBookValidationFunction,
    addBookValidationRules,
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
    updateBookController,
} from "./books.controllers.js";

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
    updateBookValidationRules,
    updateBookValidationFunction,
    updateBookController,
);

export default BookRouter;
