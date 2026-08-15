import Heading from "../../../shared/components/Heading";
import SearchBar from "../../../shared/components/SearchBar";
import BookList from "../../../shared/components/BookList";
import { useSearchParams } from "react-router-dom";
import { useSearchBooksQuery } from "../services/booksApi";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";

export function Component() {
    const [ searchParams ] = useSearchParams()
    const searchQuery = searchParams.get("q")

    const { 
        data: searchResults,
        isLoading,
        error,
        refetch
    } = useSearchBooksQuery(searchQuery)

    if ( isLoading ) {
        return <RouteLoading
            label="loading search results..."
        />
    }

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
        <Heading variant="route">
            Showing search results for: "{searchQuery}"
        </Heading>

        <SearchBar
            className="
                mt-8
                w-full lg:w-3/4
                mx-auto
            "
        />

        <BookList
            className="
                mt-16
            "
            books={
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
