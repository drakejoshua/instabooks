import BookActions from "../../../shared/components/BookActions";
import BookDetailsLayout from "../../../shared/ui/BookDetailsLayout";
import { useParams } from "react-router-dom"
import { useGetBookDetailsQuery } from "../services/booksApi";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";

export function Component() {
    const { id } = useParams()
    let { 
        data: book, 
        isLoading, 
        error, 
        refetch 
    } = useGetBookDetailsQuery( id )

    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading book details..."
            />
        )
    }

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
            <BookActions 
                className="
                    w-fit
                    mt-8 lg:mt-12
                "
            />
        </BookDetailsLayout>
    );
}
