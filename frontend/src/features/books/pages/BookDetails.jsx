import BookActions from "../../../shared/components/BookActions";
import BookDetailsLayout from "../../../shared/ui/BookDetailsLayout";
import { Link, useParams } from "react-router-dom"
import { useGetBookDetailsQuery } from "../services/booksApi";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";
import Button from "../../../shared/components/Button";
import { trackBookView } from "../../../infra/analytics/general";
import { useAuthUserData } from "../../../shared/hooks/useAuthUserData";
import { useEffect } from "react";
import { useRouteLogger } from "../../../shared/hooks/useRouteLogger";


export function Component() {
    // get the book id from the URL parameters
    const { id } = useParams()

    // fetch the book details using the 
    // useGetBookDetailsQuery hook
    let { 
        data: book, 
        isLoading, 
        error, 
        refetch 
    } = useGetBookDetailsQuery( id )

    // get the authenticated user data using the 
    // useAuthUserData hook
    const { data } = useAuthUserData();

    // log any errors that occur while fetching the 
    // book details
    useRouteLogger( 
        "Error fetching book details for user",
        error, 
        data 
    )

    // track the book view event in google analytics when 
    // the book details are successfully fetched
    useEffect(function() {
        if ( book ) {
            // since a book was successfully fetched, send a book view 
            // event to google analytics
            trackBookView( book.data )
        }
    }, [ book ])
    
    // show loading state while the book details are being fetched
    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading book details..."
            />
        )
    }

    // show error state if there is an error while fetching the book details
    if ( error ) {
        return (
            <RouteError
                heading="An error occurred while fetching book details"
                error={ error }
                refetch={ refetch }
                text="
                    There was an error while fetching the book details. 
                    Please try again later. Error code:
                "
            />
        )
    }

    // show error state if the book does not exist
    if ( book.data == null ) {
        return (
            <RouteError
                heading="The book you are looking for does not exist"
                text="
                    The book you are looking for does not exist. 
                    Please try again later. Error code:
                "
            />
        )
    }

    // show the book details if the book exists and there are no errors
    return (
        <BookDetailsLayout
            src={ book.data.cover_photo_url }
            genre={ book.data.genre }
            title={ book.data.title }
            description={ book.data.description }
            price={ book.data.price }
            quantity={ book.data.quantity }
            author={ book.data.author }
            pages={ book.data.pages }
        >
            {/* show book actions if there's a currently authenticated user */}
            {
                data && 
                <BookActions 
                    id={ id }
                    className="
                        w-fit
                        mt-8 lg:mt-12
                    "
                />
            }

            {/* 
                show add to cart button if there's no currently authenticated user 
                redirecting the user to the login page if they click on the button
            */}
            {
                !data &&
                <Button
                    className="
                        mt-8 lg:mt-12
                        w-fit
                    "
                    asChild
                >
                    <Link to="/auth/google">
                        Add to cart
                    </Link>
                </Button>
            }
        </BookDetailsLayout>
    );
}
