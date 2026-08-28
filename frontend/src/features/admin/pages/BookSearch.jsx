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

export function Component() {
    const [ searchParams ] = useSearchParams()
    const {
        data: searchData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useSearchBooksQuery( searchParams.get("query") )

    useEffect(function() {
        // send admin book search event to google analytics
        if ( searchParams.get("query") ) {
            trackAdminBookSearch( searchParams.get("query") )
        }
    }, [ searchParams ])

    useEffect( function() {
        if ( searchData?.data ) {
            // send admin book listings view event to google analytics
            trackAdminBookListView( searchData?.data )
        }
    }, [ searchData ])

    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading store books..."
            />
        )
    }

    if ( !isLoading && !isFetching && error ) {
        // log the error using the app's dedicated logger
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
            <Heading variant="route">
                Showing search results for: "{ searchParams.get("query") }"
            </Heading>

            <SearchBar
                className="
                    mt-8
                    w-full lg:w-3/4
                    mx-auto
                "
                type="admin"
            />

            {
                searchData?.data?.length === 0 &&
                <p>
                    There are no books matching the search
                    term "{ searchParams.get("query") }". Please
                    search for a different term or try again later.
                </p>
            }

            {
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

