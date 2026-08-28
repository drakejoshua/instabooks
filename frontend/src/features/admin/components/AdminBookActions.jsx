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
    const { openToast } = useToastActions()
    
    const { openDialog, closeDialog } = useDialogActions()

    let navigateTo = useNavigate()

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
    const [
        isUpdateBookDialogOpen,
        setIsUpdateBookDialogOpen
    ] = useState( false )

    const [
        deleteBook,
        { 
            isLoading: isDeletingBook,
            isFetching: isDeletingBookFetching,
        }
    ] = useDeleteBookMutation()
    
    const [
        updateBook,
        { 
            isLoading: isUpdatingBook,
            isFetching: isUpdatingBookFetching,
        }
    ] = useUpdateBookMutation()

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

    async function handleDeleteBook() {
        try {
            await deleteBook( book.id ).unwrap()

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

            let dialogId = openDialog({
                title: "Book deletion error",
                description: `There was an error while deleting the book.
                Please try again later. Error: ${ 
                    getErrorMessage( error )
                }`,
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
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    async function handleUpdateBookSubmit(e) {
        e?.preventDefault()

        let { photo, ...updatedBookDetails } = updateBookDetails

        try {
            await updateBook({
                id: book.id,
                updatedBookDetails: ( photo ) ?
                    updateBookDetails :
                    updatedBookDetails
            }).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Book updated successfully"
            })

            // send admin book update event to google analytics
            trackAdminBookUpdate( updateBookDetails )

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

            let dialogId = openDialog({
                title: "Book update error",
                description: `There was an error while updating the book.
                Please try again later. Error: ${ 
                    getErrorMessage( error )
                }`,
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

    function closeUpdateBookDialog() {
        setIsUpdateBookDialogOpen( false )

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
        <div
            className="
                mt-12
                flex
                items-center
                gap-4
            "
        >
            <Button
                onClick={ () => setIsUpdateBookDialogOpen( true ) }
            >
                Edit
            </Button>

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
