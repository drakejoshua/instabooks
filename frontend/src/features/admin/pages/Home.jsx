import { useEffect, useState } from "react";
import AltButton from "../../../shared/components/AltButton";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { FaArrowsRotate } from "react-icons/fa6";
import BookList from "../../../shared/components/BookList";
import SearchBar from "../../../shared/components/SearchBar";
import Intro from "../components/Intro";
import { useCreateBookMutation, useGetBooksQuery } from "../services/adminApi";
import RouteError from "../../../shared/ui/RouteError";
import RouteLoading from "../../../shared/ui/RouteLoading";
import { useDialogActions } from "../../../shared/ui/DialogRenderer";
import { ToastTypes, useToastActions } from "../../../shared/ui/ToastRenderer";
import { getErrorMessage } from "../../../shared/utils/utils";
import { BookDialog } from "../ui/BookDialog";
import { trackAdminBookAddition, trackAdminBookListView } from "../../../infra/analytics/admin";
import { logger } from "../../../infra/logging/logger";


// AdminHome component - This component is used to display the
// admin dashboard home page. It fetches the list of books 
// using the useGetBooksQuery hook and displays them in a
// BookList component. The component also includes an Intro
// component that provides a title and actions for managing
// the books, such as adding a new book or viewing orders.


export function Component() {
    // state to manage the current page for pagination
    const [ page, setPage ] = useState( 1 )

    // fetch the list of books using the useGetBooksQuery hook
    const {
        data: booksData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetBooksQuery( page )

    // default limit for the number of books to fetch per page
    const defaultLimit = 10

    // mutation hook to create a new book
    const [
        createBook,
        {
            isLoading: isCreatingBook,
            isFetching: isBookCreationFetching
        }
    ] = useCreateBookMutation()

    // state to manage the visibility of the create book dialog
    const [ 
        isCreateBookDialogOpen, 
        setIsCreateBookDialogOpen
    ] = useState( false )

    // state to manage the details of the new book being created
    const [ newBookDetails, setNewBookDetails ] = useState({
        title: "",
        description: "",
        pages: 0,
        price: 0,
        author: "",
        genre: "",
        photo: null,
        quantity: 0
    })

    // get toast actions from the useToastActions hook to display
    // toast notifications for success or error messages
    const { openToast } = useToastActions()
    
    // get dialog actions from the useDialogActions hook to open and close
    // dialogs for error handling during book creation
    const { openDialog, closeDialog } = useDialogActions()

    // useEffect hook to track the book listings view event for 
    // Google Analytics
    useEffect( function() {
        if ( booksData ) {
            // send book listings view event to google analytics
            trackAdminBookListView( booksData?.data?.books )
        }
    }, [ booksData ])

    // show loading state while the search results are being fetched
    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading store books..."
            />
        )
    }

    // show error state if there is an error while fetching the search results
    if ( !isLoading && !isFetching && error ) {
        // log the error using the app's dedicated logger
        // if there is an error while fetching the books
        logger.error(
            "Error fetching books for admin",
            error,
            {
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
        booksData?.data?.books?.length === 0
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

    // handleLoadMore()
    // This function is called when the "Load more books" button 
    // is clicked. It checks if there are more books to load based on the
    // total number of books and the current page. If there are more 
    // books to load, it increments the page state to fetch the next 
    // set of books.
    function handleLoadMore() {
        if ( booksData?.data?.totalBooks > ( page * defaultLimit ) ) {
            setPage( prev => prev + 1 )
        }
    }

    // closeCreateBookDialog()
    // This function is called to close the create book dialog. It resets
    // the state of the dialog visibility and clears the new book details
    // state to prepare for a new book creation.
    function closeCreateBookDialog() {
        // reset create book dialog state
        setIsCreateBookDialogOpen( false )

        // reset new book details state
        setNewBookDetails({
            title: "",
            description: "",
            pages: 0,
            price: 0,
            author: "",
            genre: "",
            photo: null,
            quantity: 0
        })
    }

    // handleCreateBookSubmit()
    // This function is called when the form to create a new book is submitted.
    // It prevents the default form submission behavior, attempts to create the
    // new book using the createBook mutation, and handles success or error
    // scenarios. On success, it displays a success toast and tracks the book
    // addition event. On error, it logs the error and opens a dialog to allow
    // the user to retry the book creation.
    async function handleCreateBookSubmit( e ) {
        // prevent the default form submission behavior
        e?.preventDefault()

        try {
            // attempt to create the new book using the createBook mutation
            await createBook( newBookDetails ).unwrap()

            // display a success toast notification for successful 
            // book creation
            openToast({
                type: ToastTypes.success,
                message: "Book created successfully"
            })

            // send admin book creation event to google analytics
            trackAdminBookAddition( newBookDetails )

            // close the create book dialog after successful creation
            closeCreateBookDialog()
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error creating new book for admin",
                error,
                {
                    requestId: error?.requestId,
                    bookDetails: newBookDetails
                }
            )

            // open a dialog to allow the user to retry the book creation
            let dialogId = openDialog({
                title: "Book creation error",
                description: `An error occured while trying to create
                the new book. Error: ${ 
                    getErrorMessage( error )
                }`,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )

                                handleCreateBookSubmit()
                            }}
                            className="
                                mt-4
                                w-full
                                block
                            "
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    return (<>
        <div
            className="pb-16"
        >
            {/* intro section */}
            <Intro 
                title="Manage books"
                className="mt-4"
            >
                {/* add book button */}
                <Button
                    onClick={ () => setIsCreateBookDialogOpen( true ) }
                >
                    Add new book
                </Button>

                {/* view orders link */}
                <AltButton asChild>
                    <Link to="/admin/orders">
                        view orders
                    </Link>
                </AltButton>
            </Intro>

            {/* search bar */}
            <SearchBar 
                className="
                    mt-6
                "
                type="admin"
            />

            {/* all books section */}
            <section
                className="
                    mt-16
                "
            >
                {/* book grid */}
                <BookList
                    type="admin"
                    className="mt-14"
                    books={
                        booksData?.data?.books?.map(function( book ) {
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
            </section>

            {/* load more button */}
            {
                booksData?.data?.totalBooks > ( page * defaultLimit ) &&
                <AltButton
                    className="
                        flex!
                        items-center
                        gap-4
                        mt-14 lg:mt-20
                        mx-auto
                        group
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                    disabled={ isFetching }
                    onClick={ handleLoadMore }
                >
                    <FaArrowsRotate className="group-disabled:animate-spin"/>

                    Load more books
                </AltButton>
            }
        </div>;

        {/* book dialog */}
        <BookDialog 
            title="Add new book"
            description="
                Fill in the details of the new book to 
                add it to the store
            "
            open={ isCreateBookDialogOpen }
            onOpenChange={ closeCreateBookDialog }
            bookDetails={ newBookDetails }
            setBookDetails={ setNewBookDetails }
            handleSubmit={ handleCreateBookSubmit }
            isSubmitting={ isCreatingBook || isBookCreationFetching }
            submitButtonLabel="Add book"
            loadingButtonLabel="Adding book..."
        />
    </>)
}