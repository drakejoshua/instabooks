import { FaArrowLeft, FaArrowRight, FaArrowsRotate } from "react-icons/fa6";
import Heading from "../../shared/components/Heading";
import BookList from "../../shared/components/BookList";
import AltButton from "../../shared/components/AltButton";
import SearchBar from "../../shared/components/SearchBar";
import Carousel from "./components/Carousel";
import Button from "../../shared/components/Button";
import { Link } from "react-router-dom";
import { useGetBooksQuery } from "../books/services/booksApi";
import { useEffect, useState } from "react";
import RouteLoading from "../../shared/ui/RouteLoading";
import RouteError from "../../shared/ui/RouteError";
import { trackBookListingsView } from "../../infra/analytics/general";
import { useAuthUserData } from "../../shared/hooks/useAuthUserData.jsx";
import { useRouteLogger } from "../../shared/hooks/useRouteLogger.jsx";

export function Home() {
    // state for managing the current page of books to fetch
    const [ page, setPage ] = useState( 1 )

    // fetch the books data using the useGetBooksQuery hook
    const { 
        isLoading, 
        data: bookResponse, 
        error,
        isFetching
    } = useGetBooksQuery( page )

    // get the authenticated user data using the useAuthUserData hook
    const { data } = useAuthUserData();

    // define the defaultLimit for the number of books to fetch per page
    const DefaultLimit = 10

    // handleRetry()
    // This function is called when the user clicks the 
    // "Load more books" button. It checks if there are 
    // more books to fetch based on the current page and 
    // the total number of books available. If there are 
    // more books, it increments the page state to fetch 
    // the next set of books.
    function handleRetry() {
        if ( ( page * DefaultLimit ) < bookResponse?.data?.totalBooks ) {
            setPage( page + 1 )
        }
    }

    // log any errors that occur while fetching books using the 
    // useRouteLogger hook
    useRouteLogger( 
        "Error fetching books for user",
        error, 
        data 
    )

    // track the book listings view event in google analytics when 
    // the bookResponse data is successfully fetched
    useEffect( function() {
        if ( bookResponse ) {
            // send book listings view event to google analytics
            trackBookListingsView( bookResponse?.data?.books, "home" )
        }
    }, [ bookResponse ])

    // show a loading indicator while the books data is being fetched
    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading books..."
            />
        )
    }

    // show an error message if there was an error fetching the books data
    if ( error ) {
        return (
            <RouteError
                heading="An error occurred while fetching books"
                error={ error }
                refetch={ () => setPage( 1 ) }
                text="
                    There was an error while fetching the books. 
                    Please try again later. Error:
                "
            />
        )
    }

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
                {/* 
                    carousel track - to house slides and provide the 
                    sliding transition/animation
                */}
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
                    {
                        // map over the first 3 books in the bookResponse data to create
                        // individual BookItem components for the carousel slides
                        bookResponse?.data?.books.slice( 1, 4 ).map( ( book ) => (
                            <BookItem
                                key={ book.id }
                                title={ book.title }
                                description={ book.description }
                                to={ `/books/details/${book.id}` }
                                src={ book.cover_photo_url }
                            />
                        ) )
                    }
                </Carousel.Track>

                {/* carousel navigation buttons and indicators */}
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
                    {/* carousel navigation buttons */}
                    <div
                        className="
                        flex
                        text-white
                        gap-3
                        text-3xl
                    "
                    >
                        {/* prev button */}
                        <Carousel.PrevButton>
                            <FaArrowLeft />
                        </Carousel.PrevButton>

                        {/* next button */}
                        <Carousel.NextButton>
                            <FaArrowRight />
                        </Carousel.NextButton>
                    </div>

                    {/* carousel indicators */}
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
                {/* section heading */}
                <Heading variant="route">Browse all books</Heading>

                {/* section description */}
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
                    books={
                        // map the bookResponse data to the format expected by 
                        // the BookList component
                        bookResponse?.data?.books.map( book => ({
                            id: book.id,
                            title: book.title,
                            description: book.description,
                            author: book.author,
                            pages: book.pages,
                            price: book.price,
                            genre: book.genre,
                            photoUrl: book.cover_photo_url,
                        }) )
                    }
                />
            </section>

            {/* load more button */}
            { ( page * DefaultLimit < bookResponse?.data?.totalBooks ) &&
                <AltButton
                    className="
                        flex!
                        items-center
                        gap-4
                        mt-14 lg:mt-20
                        mx-auto
                    "
                    onClick={ handleRetry }
                >
                    <FaArrowsRotate
                        className={`
                            ${ isFetching ? "animate-spin" : "" }
                        `}
                    />

                    Load more books
                </AltButton>
            }
        </div>
    );
}

export default Home;


// BookItem component - represents an individual book item in the carousel
// acts as a wrapper for the carousel's slide item and displays the book's 
// title, description, cover photo and a link to the book's details page. 
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
                {/* book title */}
                <Heading
                    className="
                    text-white
                    text-4xl
                    line-clamp-2
                "
                >
                    {title}
                </Heading>

                {/* book description */}
                <p
                    className="
                    mt-4
                    line-clamp-4 lg:line-clamp-3
                "
                >
                    {description}
                </p>

                {/* learn more button */}
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

            {/* book cover photo */}
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
                object-cover
                object-center
                opacity-30 lg:opacity-100   
            "
            />
        </Carousel.Item>
    );
}
