import Heading from '../../../shared/components/Heading'
import SearchBar from '../../../shared/components/SearchBar'
import BookList from '../../../shared/components/BookList'
import RouteError from '../../../shared/ui/RouteError'
import RouteLoading from '../../../shared/ui/RouteLoading'
import { useSearchBooksQuery } from '../services/adminApi'
import { useSearchParams } from 'react-router-dom'
import { trackAdminBookListView, trackAdminBookSearch } from '../../../infra/analytics/admin'
import { logger } from '../../../infra/logging/logger'
import { useEffect } from 'react'


// BookSearch component - This component is used to display the 
// search results for books in the admin dashboard. It fetches 
// the search results using the useSearchBooksQuery hook and 
// displays them in a BookList component. The component also 
// includes a SearchBar component that allows the user to 
// search for books. If there is an error while fetching the 
// search results, a RouteError component is displayed with 
// an option to retry fetching the data. While the data is 
// being fetched, a RouteLoading component is displayed. The 
// component also tracks the admin book search and book listings 
// view events in Google Analytics.


export function Component() {
    // get the search query from the URL parameters
    const [ searchParams ] = useSearchParams()

    // fetch the search results using the useSearchBooksQuery hook
    const {
        data: searchData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useSearchBooksQuery( searchParams.get("query") )

    // track the admin book search event in google analytics 
    // when the search query changes
    useEffect(function() {
        // send admin book search event to google analytics
        if ( searchParams.get("query") ) {
            trackAdminBookSearch( searchParams.get("query") )
        }
    }, [ searchParams ])

    // track the admin book listings view event in google analytics 
    // when the search results are successfully fetched
    useEffect( function() {
        if ( searchData?.data ) {
            // send admin book listings view event to google analytics
            trackAdminBookListView( searchData?.data )
        }
    }, [ searchData ])

    // show loading state while the search results are being 
    // fetched
    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading store books..."
            />
        )
    }

    // show error state if there is an error while fetching the 
    // search results
    if ( !isLoading && !isFetching && error ) {
        // log the error using the app's dedicated logger
        // if there is an error while searching for books
        logger.error(
            "Error searching for books for admin",
            error,
            {
                searchQuery: searchParams.get("query"),
                requestId: error?.requestId
            }
        );

        return (
            <RouteError
                heading="An error occurred while searching for books"
                error={ error }
                refetch={ refetch }
                text={`
                    There was an error while searching for that book. 
                    Please try again later. Error: 
                `}
                retryLoadingStatus={ isLoading || isFetching }
                buttonLabel="Retry"
            />
        )
    }

    return (
        <div
            className="pb-8 lg:pb-16"
        >
            {/* route heading */}
            <Heading variant="route">
                Showing search results for: "{ searchParams.get("query") }"
            </Heading>

            {/* search bar */}
            <SearchBar
                className="
                    mt-8
                    w-full lg:w-3/4
                    mx-auto
                "
                type="admin"
            />

            {
                // show empty state if there are no books matching the search term
                searchData?.data?.length === 0 &&
                <p>
                    There are no books matching the search
                    term "{ searchParams.get("query") }". Please
                    search for a different term or try again later.
                </p>
            }

            {
                // show the search results if there are books matching the search term
                searchData?.data?.length !== 0 &&
                <BookList
                    type="admin"
                    className="
                        mt-16
                    "
                    books={
                        searchData?.data.map(function(book) {
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
                        })
                    }
                />
            }
        </div>
    )
}

