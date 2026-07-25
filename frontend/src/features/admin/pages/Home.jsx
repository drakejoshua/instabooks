import React from "react";
import Heading from "../../../shared/components/Heading";
import AltButton from "../../../shared/components/AltButton";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { FaArrowsRotate } from "react-icons/fa6";
import BookList from "../../../shared/components/BookList";
import SearchBar from "../../../shared/components/SearchBar";
import Intro from "../components/Intro";

export function Component() {
    return <div
        className="pb-16"
    >
        {/* intro section */}
        <Intro 
            title="Manage books"
            className="mt-4"
        >
            <Button>
                Add new book
            </Button>

            <AltButton asChild>
                <Link to="/admin/orders">
                    view orders
                </Link>
            </AltButton>
        </Intro>

            

        {/* search bar */}
        <SearchBar 
            className="
                mt-6
            "
        />

        {/* all books section */}
        <section
            className="
                mt-16
            "
        >
            {/* book grid */}
            <BookList
                type="admin"
                className="mt-14"
                books={[
                    {
                        title: "How to Win Friends and Influence People",
                        description: `This timeless classic by Dale 
                        Carnegie offers practical advice on how to 
                        improve your social skills, build meaningful 
                        relationships, and become a more influential 
                        person in both your personal and professional life.`,
                        author: "Dale Carnegie",
                        pages: 302,
                        price: 10.00,
                        genre: "Finance",
                        photoUrl: "https://picsum.photos/id/24/400"
                    },
                    {
                        title: "How to Win Friends and Influence People",
                        description: `This timeless classic by Dale 
                        Carnegie offers practical advice on how to 
                        improve your social skills, build meaningful 
                        relationships, and become a more influential 
                        person in both your personal and professional life.`,
                        author: "Dale Carnegie",
                        pages: 302,
                        price: 10.00,
                        genre: "Finance",
                        photoUrl: "https://picsum.photos/id/24/400"
                    },
                    {
                        title: "How to Win Friends and Influence People",
                        description: `This timeless classic by Dale 
                        Carnegie offers practical advice on how to 
                        improve your social skills, build meaningful 
                        relationships, and become a more influential 
                        person in both your personal and professional life.`,
                        author: "Dale Carnegie",
                        pages: 302,
                        price: 10.00,
                        genre: "Finance",
                        photoUrl: "https://picsum.photos/id/24/400"
                    },
                    {
                        title: "How to Win Friends and Influence People",
                        description: `This timeless classic by Dale 
                        Carnegie offers practical advice on how to 
                        improve your social skills, build meaningful 
                        relationships, and become a more influential 
                        person in both your personal and professional life.`,
                        author: "Dale Carnegie",
                        pages: 302,
                        price: 10.00,
                        genre: "Finance",
                        photoUrl: "https://picsum.photos/id/24/400"
                    },
                ]}
            />
        </section>

        {/* load more button */}
        <AltButton
            className="
                flex
                items-center
                gap-4
                mt-14 lg:mt-20
                mx-auto

            "
        >
            <FaArrowsRotate />

            Load more books
        </AltButton>
    </div>;
}
