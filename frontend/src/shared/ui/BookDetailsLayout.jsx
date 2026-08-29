import React from "react";
import { FaCircleUser, FaFileLines } from "react-icons/fa6";
import Badge from "../components/Badge";

// BookDetailsLayout component - a layout component for displaying book details.
// It takes in various props such as the book's image source, genre, title,
// description, price, quantity, author, and number of pages. It also accepts
// children components that can be rendered within the layout.

function BookDetailsLayout({
    src = "",
    genre = "",
    title = "",
    description = "",
    price = 0,
    quantity = 0,
    author = "",
    pages = 0,
    children
}) {
    return <div
        className="
        grid
        grid-cols-1 lg:grid-cols-[2fr_3fr]
        gap-8 lg:gap-12
        pb-12
    "
    >
        <img
            src={ src }
            alt={`Book Cover of ${title}`}
            className="
            w-full
            object-cover
            object-top
            rounded-md
            max-h-100 lg:max-h-[calc(100vh-8rem)]
        "
        />

        <div>
            {/* book genre */}
            <Badge
                className="mt-4"
            >
                { genre }
            </Badge>

            {/* book title */}
            <h1
                className="
                text-4xl
                font-medium
                mt-3
                capitalize
            "
            >
                { title }
            </h1>

            {/* book description */}
            <p
                className="
                mt-4
                text-instabooks-black
            "
            >
                { description }
            </p>

            {/* book price */}
            <p
                className="
                mt-4
                flex
                items-end
                gap-2
            "
            >
                <span
                    className="
                    text-4xl
                    font-medium
                "
                >
                    ${ price.toFixed(2) }
                </span>

                <span className="text-instabooks-black">{quantity} in stock</span>
            </p>

            {/* book metadata */}
            <div
                className="
                mt-10
                flex
                items-center
                gap-6

                *:flex
                *:flex-col
                *:items-start
                *:gap-1.5
                [&_.metadata-icon]:ml-0.5
                [&_.metadata-icon]:text-instabooks-blue
                [&_.metadata-icon]:text-xl
                [&_.metadata-text]:capitalize
                [&_.metadata-text]:font-medium
            "
            >
                {/* author */}
                <div className="metadata">
                    <FaCircleUser className="metadata-icon" />

                    <span className="metadata-text">{author}</span>
                </div>

                {/* pages */}
                <div className="metadata">
                    <FaFileLines className="metadata-icon" />

                    <span className="metadata-text">{pages} pages</span>
                </div>
            </div>

            {children}
        </div>
    </div>;
}

export default BookDetailsLayout;
