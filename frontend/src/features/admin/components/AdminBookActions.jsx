// import necessary dependencies and components
import Button from "../../../shared/components/Button";
import AltButton from "../../../shared/components/AltButton";
import { useDialogActions } from "../../../shared/ui/DialogRenderer";
import { ToastTypes, useToastActions } from "../../../shared/ui/ToastRenderer";
import { useDeleteBookMutation, useUpdateBookMutation } from "../services/adminApi";
import { getErrorMessage } from "../../../shared/utils/utils";
import { BookDialog } from "../ui/BookDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackAdminBookDeletion, trackAdminBookUpdate } from "../../../infra/analytics/admin";
import { logger } from "../../../infra/logging/logger";


function AdminBookActions({ book }) {
    // initialize toast actions for alerting users
    // using toasts from the actions performed 
    // through this component
    const { openToast } = useToastActions()
    
    // initialize dialog actions for confirming user actions
    // or alerting users of errors through dialogs through this component
    const { openDialog, closeDialog } = useDialogActions()

    // react-router-dom's useNavigate hook to programmatically 
    // navigate to different routes
    let navigateTo = useNavigate()

    // state to manage the book details being updated
    const [
        updateBookDetails,
        setUpdateBookDetails
    ] = useState({
        title: book.title,
        description: book.description,
        pages: book.pages,
        price: book.price,
        author: book.author,
        genre: book.genre,
        photo: null,
        quantity: book.quantity
    })

    // state to manage the visibility of the update book dialog
    const [
        isUpdateBookDialogOpen,
        setIsUpdateBookDialogOpen
    ] = useState( false )

    // initialize the deleteBook and updateBook mutations from the adminApi slice
    const [
        deleteBook,
        { 
            isLoading: isDeletingBook,
            isFetching: isDeletingBookFetching,
        }
    ] = useDeleteBookMutation()
    
    // initialize the updateBook mutation from the adminApi slice
    const [
        updateBook,
        { 
            isLoading: isUpdatingBook,
            isFetching: isUpdatingBookFetching,
        }
    ] = useUpdateBookMutation()

    // confirmDeleteBook() - opens a confirmation dialog before deleting 
    // a book 
    function confirmDeleteBook() {
        let dialogId = openDialog({
            title: "Confirm Book Deletion",
            description: `Are you sure you want to delete 
            this book?`,
            render: function() {
                return (
                    <Button
                        className="
                            mt-4
                            w-full
                            block
                        "
                        onClick={function() {
                            closeDialog( dialogId )
                            
                            handleDeleteBook()
                        }}
                    >
                        Delete Book
                    </Button>
                )
            }
        })
    }

    // handleDeleteBook() - handles the deletion of a book by calling 
    // the deleteBook mutation
    async function handleDeleteBook() {
        try {
            // call the deleteBook mutation and unwrap the result to 
            // handle any errors
            await deleteBook( book.id ).unwrap()

            // show a success toast to the user indicating that the 
            // book was deleted successfully
            openToast({
                type: ToastTypes.success,
                message: "Book deleted successfully"
            })

            // send admin book deletion event to google analytics
            trackAdminBookDeletion( book )

            // navigate back to admin books to indicate 
            // deletion
            navigateTo("/admin/books")
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error deleting book for admin",
                error,
                {
                    bookId: book.id,
                    requestId: error?.requestId
                }
            )

            // open a dialog to inform the user of the error and provide a retry option
            let dialogId = openDialog({
                title: "Book deletion error",
                description: `There was an error while deleting the book.
                Please try again later. Error: ${ 
                    getErrorMessage( error )
                }`,
                render: function() {
                    return (
                        // render a retry button that allows the user to attempt 
                        // the deletion again
                        <Button
                            className="
                                mt-4
                                w-full
                                block
                            "
                            onClick={function() {
                                closeDialog( dialogId )
                                handleDeleteBook()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    // handleUpdateBookSubmit() - handles the submission of the updated
    // book details by calling the updateBook mutation
    async function handleUpdateBookSubmit(e) {
        // prevent the default form submission behavior 
        // if an event is provided
        e?.preventDefault()

        // destructure the photo from the updateBookDetails to handle
        // the case where the photo is not being updated, in which case
        // we don't want to send it in the request payload
        let { photo, ...updatedBookDetails } = updateBookDetails

        try {
            // call the updateBook mutation and unwrap the result 
            // to handle any errors
            await updateBook({
                id: book.id,
                updatedBookDetails: ( photo ) ?
                    updateBookDetails :
                    updatedBookDetails
            }).unwrap()

            // show a success toast to the user indicating that the 
            // book was updated successfully
            openToast({
                type: ToastTypes.success,
                message: "Book updated successfully"
            })

            // send admin book update event to google analytics
            trackAdminBookUpdate( updateBookDetails )

            // close the update book dialog and reset the updateBookDetails 
            // state
            closeUpdateBookDialog()
        } catch( error ) { 
            // log the error using the app's dedicated logger
            logger.error(
                "Error updating book for admin",
                error,
                {
                    bookId: book.id,
                    requestId: error?.requestId
                }
            )

            // open a dialog to inform the user of the error and provide a retry option
            let dialogId = openDialog({
                title: "Book update error",
                description: `There was an error while updating the book.
                Please try again later. Error: ${ 
                    getErrorMessage( error )
                }`,
                render: function() {
                    return (
                        // render a retry button that allows the user to attempt 
                        // the update again
                        <Button
                            className="
                                mt-4
                                w-full
                                block
                            "
                            onClick={function() {
                                closeDialog( dialogId )
                                handleUpdateBookSubmit()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    // closeUpdateBookDialog() - closes the update book dialog 
    // and resets the updateBookDetails state to the original 
    // book details
    function closeUpdateBookDialog() {
        // close the update book dialog
        setIsUpdateBookDialogOpen( false )

        // reset the updateBookDetails state to the 
        // original book details
        setUpdateBookDetails({
            title: book.title,
            description: book.description,
            pages: book.pages,
            price: book.price,
            author: book.author,
            genre: book.genre,
            photo: null,
            quantity: book.quantity
        })
    }

    return (<>
        {/* book action button group */}
        <div
            className="
                mt-12
                flex
                items-center
                gap-4
            "
        >
            {/* edit button */}
            <Button
                onClick={ () => setIsUpdateBookDialogOpen( true ) }
            >
                Edit
            </Button>

            {/* delete button */}
            <AltButton
                onClick={ confirmDeleteBook }
                disabled={ isDeletingBook || isDeletingBookFetching }
                className="
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >
                {
                    ( isDeletingBook || isDeletingBookFetching) ? 
                    "Deleting..." :
                    "Delete"
                }
            </AltButton>
        </div>

        {/* update book dialog */}
        <BookDialog
            title="Update book details"
            description="
                Update the details of the book. Fill in the fields below 
                and click on the 'Save' button to save the changes.
            "
            bookDetails={ updateBookDetails }
            setBookDetails={ setUpdateBookDetails }
            open={ isUpdateBookDialogOpen }
            onOpenChange={ closeUpdateBookDialog }
            isSubmitting={ isUpdatingBook || isUpdatingBookFetching }
            handleSubmit={ handleUpdateBookSubmit }
            submitButtonLabel="Update book details"
            loadingButtonLabel="Updating..."
        />
    </>);
}

export default AdminBookActions;
