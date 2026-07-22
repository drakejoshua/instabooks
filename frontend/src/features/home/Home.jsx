import { FaArrowsRotate } from "react-icons/fa6";
import Heading from "../../shared/components/Heading";
import BookList from "../../shared/components/BookList";
import AltButton from "../../shared/components/AltButton";
import SearchBar from "../../shared/components/SearchBar";

export function Home() {
    return <div
        className="pb-8 lg:pb-12"
    >
        {/* search bar */}
        <SearchBar />

        {/* home carousel */}
        <div
            className="
                h-screen
                max-h-100
                bg-gray-200
                mt-4
                rounded-lg
                overflow-hidden
            "
        >
            {/* TODO: custom carousel implementation here */}
        </div>

        {/* all books section */}
        <section
            className="
                mt-16
            "
        >
            <Heading variant="route">
                Browse all books
            </Heading>

            <p
                className="
                    text-center
                    max-w-125
                    mx-auto
                    mt-3
                "
            >
                Explore our extensive collection of books across various 
                genres and categories. Find your next great read today!
            </p>

            {/* book grid */}
            <BookList
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

export default Home;
