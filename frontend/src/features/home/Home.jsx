import { FaArrowLeft, FaArrowRight, FaArrowsRotate } from "react-icons/fa6";
import Heading from "../../shared/components/Heading";
import BookList from "../../shared/components/BookList";
import AltButton from "../../shared/components/AltButton";
import SearchBar from "../../shared/components/SearchBar";
import Carousel from "./components/Carousel";
import Button from "../../shared/components/Button";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className="pb-8 lg:pb-12">
            {/* search bar */}
            <SearchBar />

            {/* home carousel */}
            <Carousel.Root
                className="
                h-screen
                max-h-150
                bg-instabooks-blue
                mt-4
                rounded-xl
                overflow-hidden
                relative
                top-0
            "
            >
                <Carousel.Track
                    className="
                    h-full
                    w-full
                    flex
                    items-center
                    gap-0
                    bg-inherit
                    transition-transform
                    translate-x-[calc(var(--active-slide)*-100%)]
                "
                >
                    <BookItem
                        title="The great gatsby"
                        description="A novel by F. Scott Fitzgerald that 
                    explores themes of wealth, love, and the American 
                    Dream in 1920s America."
                        to="/books/the-great-gatsby-2"
                        src="https://picsum.photos/id/24/200"
                    />

                    <BookItem
                        title="How to Win Friends and Influence People"
                        description="A timeless classic by Dale Carnegie that 
                    offers practical advice on how to improve your social
                    skills, build meaningful relationships, and become a 
                    more influential person in both your personal and 
                    professional life."
                        to="/books/how-to-win-friends-and-influence-people"
                        src="https://picsum.photos/id/24/200"
                    />

                    <BookItem
                        title="Rich Dad Poor Dad"
                        description="A personal finance book by Robert Kiyosaki 
                    that contrasts the financial philosophies of his two 
                    'dads' and provides insights on how to achieve financial 
                    independence and build wealth."
                        to="/books/rich-dad-poor-dad"
                        src="https://picsum.photos/id/24/200"
                    />
                </Carousel.Track>

                <div
                    className="
                    absolute
                    left-1/2 lg:left-16
                    -translate-x-1/2 lg:translate-x-0
                    bottom-8 lg:bottom-26
                    flex
                    items-center
                    gap-4
                    flex-col-reverse lg:flex-row
                "
                >
                    <div
                        className="
                        flex
                        text-white
                        gap-3
                        text-3xl
                    "
                    >
                        <Carousel.PrevButton>
                            <FaArrowLeft />
                        </Carousel.PrevButton>

                        <Carousel.NextButton>
                            <FaArrowRight />
                        </Carousel.NextButton>
                    </div>

                    <Carousel.Indicators
                        className="
                        flex
                        gap-2

                        *:w-6
                        *:h-1
                        *:rounded-full
                        *:bg-gray-400
                        *:data-[active-slide=true]:bg-white
                        *:cursor-pointer    
                    "
                    >
                        <Carousel.Indicator />

                        <Carousel.Indicator />

                        <Carousel.Indicator />
                    </Carousel.Indicators>
                </div>
            </Carousel.Root>

            {/* all books section */}
            <section
                className="
                mt-16
            "
            >
                <Heading variant="route">Browse all books</Heading>

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
                            price: 10.0,
                            genre: "Finance",
                            photoUrl: "https://picsum.photos/id/24/400",
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
                            price: 10.0,
                            genre: "Finance",
                            photoUrl: "https://picsum.photos/id/24/400",
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
                            price: 10.0,
                            genre: "Finance",
                            photoUrl: "https://picsum.photos/id/24/400",
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
                            price: 10.0,
                            genre: "Finance",
                            photoUrl: "https://picsum.photos/id/24/400",
                        },
                    ]}
                />
            </section>

            {/* load more button */}
            <AltButton
                className="
                flex!
                items-center
                gap-4
                mt-14 lg:mt-20
                mx-auto

            "
            >
                <FaArrowsRotate />
                Load more books
            </AltButton>
        </div>
    );
}

export default Home;

function BookItem({ title, description, to = "", src = "" }) {
    return (
        <Carousel.Item
            className="
            flex-[0_0_100%]
            h-full
            lg:flex
            items-center
            relative lg:static
        "
        >
            <div
                className="
                text-white
                lg:w-2/5
                lg:ml-15
                p-6 md:p-22 lg:p-0
                absolute lg:static
                top-1/2
                -translate-y-1/2 lg:translate-y-0
                z-1

                *:text-center lg:*:text-left
            "
            >
                <Heading
                    className="
                    text-white
                    text-4xl
                    line-clamp-3
                "
                >
                    {title}
                </Heading>

                <p
                    className="
                    mt-4
                    line-clamp-4 lg:line-clamp-6
                "
                >
                    {description}
                </p>

                <Button
                    asChild
                    className="
                    mt-8
                    bg-white
                    outline-white
                    text-instabooks-blue!
                    capitalize
                    mx-auto lg:mx-0
                    block! lg:inline-block
                    w-fit
                "
                >
                    <Link to={to}>learn more</Link>
                </Button>
            </div>

            <img
                src={src}
                alt="book photo"
                className="
                h-full
                w-full lg:w-2/5
                absolute lg:static
                left-0
                top-0
                ml-auto
                opacity-30 lg:opacity-100   
            "
            />
        </Carousel.Item>
    );
}
