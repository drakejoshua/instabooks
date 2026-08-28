import { useParams } from "react-router-dom";
import BookDetailsLayout from "../../../shared/ui/BookDetailsLayout";
import AdminBookActions from "../components/AdminBookActions";
import { useGetBookByIdQuery } from "../services/adminApi";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";
import { trackAdminBookView } from "../../../infra/analytics/admin";
import { logger } from "../../../infra/logging/logger";
import { useEffect } from "react";

export function Component() {
    const { id } = useParams()

    const {
        data:bookDetailsData,
        error,
        isFetching,
        isLoading,
        refetch
    } = useGetBookByIdQuery( id )

    const bookDetail = bookDetailsData?.data

    useEffect( function() {
        if ( bookDetailsData ) {
            // send admin book view event to google analytics
            trackAdminBookView( bookDetail )
        }
    }, [bookDetailsData])


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
            "Error fetching book details for admin", 
            error, 
            { 
                bookId: id,
                requestId: error?.requestId
            }
        );

        return (
            <RouteError
                heading="An error occurred while fetching books"
                error={ error }
                refetch={ refetch }
                text={`
                    There was an error while fetching the books. 
                    Please try again later. Error: 
                `}
                retryLoadingStatus={ isLoading || isFetching }
                buttonLabel="Retry"
            />
        )
    }

    if ( 
        !isLoading && !isFetching &&
        !bookDetailsData?.data
    ) {
        return (
            <p
                className="
                    text-center
                    opacity-50
                "
            >
                There are no books in the store
            </p>
        )
    }


    return (
        <BookDetailsLayout
            src={bookDetail.cover_photo_url}
            genre={bookDetail.genre}
            title={bookDetail.title}
            description={bookDetail.description}
            price={bookDetail.price}
            quantity={bookDetail.quantity}
            author={bookDetail.author}
            pages={bookDetail.pages}
        >
            <AdminBookActions book={bookDetail}/>
        </BookDetailsLayout>
    );
}
