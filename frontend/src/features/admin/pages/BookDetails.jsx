// import necessary dependencies and components
import { useParams } from "react-router-dom";
import BookDetailsLayout from "../../../shared/ui/BookDetailsLayout";
import AdminBookActions from "../components/AdminBookActions";
import { useGetBookByIdQuery } from "../services/adminApi";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";
import { trackAdminBookView } from "../../../infra/analytics/admin";
import { logger } from "../../../infra/logging/logger";
import { useEffect } from "react";


// BookDetails component - This component is used to display 
// the details of a specific book in the admin dashboard. 
// It fetches the book details using the useGetBookByIdQuery 
// hook and displays them in a BookDetailsLayout component. 
// The component also includes an AdminBookActions component 
// that provides actions for managing the book, such as editing 
// or deleting it. If there is an error while fetching the book details, 
// a RouteError component is displayed with an option to retry fetching 
// the data. While the data is being fetched, a RouteLoading component 
// is displayed.


export function Component() {
    // get the book id from the URL parameters
    const { id } = useParams()

    // fetch the book details using the useGetBookByIdQuery hook
    const {
        data:bookDetailsData,
        error,
        isFetching,
        isLoading,
        refetch
    } = useGetBookByIdQuery( id )

    // extract the book details from the fetched data
    const bookDetail = bookDetailsData?.data

    // track the admin book view event in google analytics 
    // when the book details are successfully fetched
    useEffect( function() {
        if ( bookDetailsData ) {
            // send admin book view event to google analytics
            trackAdminBookView( bookDetail )
        }
    }, [bookDetailsData])


    // show loading state while the book details are being fetched
    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading store books..."
            />
        )
    }

    // show error state if there is an error while fetching the book details
    if ( !isLoading && !isFetching && error ) {
        // log the error using the app's dedicated logger
        // if there is an error while fetching the book details
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

    // show empty state if there are no books in the store
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
