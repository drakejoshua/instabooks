import Heading from "../../../shared/components/Heading";
import SearchBar from "../../../shared/components/SearchBar";
import BookList from "../../../shared/components/BookList";
import { useSearchParams } from "react-router-dom";
import { useSearchBooksQuery } from "../services/booksApi";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";
import { trackBookListingsView, trackSearch } from "../../../infra/analytics/general";
import { useAuthUserData } from "../../../shared/hooks/useAuthUserData";
import { useEffect } from "react";
import { useRouteLogger } from "../../../shared/hooks/useRouteLogger";

export function Component() {
    // retrieve the search query from the URL parameters 
    // using the useSearchParams hook
    const [ searchParams ] = useSearchParams()
    const searchQuery = searchParams.get("q")

    // track the search event in google analytics when the 
    // search query changes
    useEffect( function() {
        // send search event to google analytics
        if ( searchQuery ) {
            trackSearch( searchQuery )
        }
    }, [ searchQuery ])

    // fetch the search results using the useSearchBooksQuery 
    // hook
    const { 
        data: searchResults,
        isLoading,
        error,
        refetch
    } = useSearchBooksQuery(searchQuery)

    // get the authenticated user data using the useAuthUserData 
    // hook
    const { data } = useAuthUserData();

    // track the book listings view event in google analytics when 
    // the search results are successfully fetched
    useEffect( function() {
        if ( searchResults?.data ) {
            // send book listings view event to google analytics
            trackBookListingsView( searchResults.data, "search" )
        }
    }, [ searchResults ])

    // log any errors that occur while searching for books using 
    // the useRouteLogger hook
    useRouteLogger( 
        "Error searching books for user",
        error, 
        data 
    )

    // show a loading indicator while the search results are 
    // being fetched
    if ( isLoading ) {
        return <RouteLoading
            label="loading search results..."
        />
    }

    // show an error message if there was an error fetching the 
    // search results
    if ( error ) {
        return <RouteError 
            heading="There was an error loading this page"
            text={`
                An error occured while trying to fetch the search results
                for your search term: "${ searchQuery }". Error: 
            `}
            refetch={ refetch }
            error={ error }
        />
    }

    // show a message if there were no search results found for the 
    // search query
    if ( searchResults.data.length == 0 ) {
        return <div
            className="
                flex
                gap-4
                justify-center
                items-center
            "
        >
            There were no books found for your search term: 
            "{ searchQuery }"
        </div>
    }

    return <div
        className="pb-8 lg:pb-12"
    >   
        {/* route heading */}
        <Heading variant="route">
            Showing search results for: "{searchQuery}"
        </Heading>

        {/* search bar and input */}
        <SearchBar
            className="
                mt-8
                w-full lg:w-3/4
                mx-auto
            "
        />

        {/* book list */}
        <BookList
            className="
                mt-16
            "
            books={
                // map the search results to the format expected 
                // by the BookList component
                searchResults?.data.map( function( book ) {
                    return {
                        id: book.id,
                        title: book.title,
                        description: book.description,
                        author: book.author,
                        pages: book.pages,
                        price: book.price,
                        genre: book.genre,
                        photoUrl: book.cover_photo_url
                    }
                } )
            }
        />
    </div>;
}
