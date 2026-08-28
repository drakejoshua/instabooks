import { FaCircleNotch, FaMinus, FaPlus } from "react-icons/fa6";
import Button from "./Button";
import { useGetMeQuery } from "../../features/users/services/authApi";
import { useAddBookToCartMutation, useDeleteBookFromCartMutation, useUpdateBookInCartMutation } from "../services/userApi";
import { ToastTypes, useToastActions } from "../ui/ToastRenderer";
import { useDialogActions } from "../ui/DialogRenderer";
import { getErrorMessage } from "../utils/utils";
import { logger } from "../../infra/logging/logger";

export default function BookActions({ id, className = "" }) {
    // get user information through the redux query 
    // or from cache
    const { data: user } = useGetMeQuery()

    // addBookToCart mutation to add books to user's 
    // cart
    const [ 
        addBookToCart, 
        { 
            isLoading: isAddBookActionLoading,
            error: addBookActionError
        }
    ] = useAddBookToCartMutation()

    // updateBookInCart mutation to update the quantity 
    // of books in user's cart
    const [
        updateBookInCart,
        {
            isLoading: isUpdateBookActionLoading,
            error: updateBookActionError
        }
    ] = useUpdateBookInCartMutation()

    const [
        deleteBookFromCart,
        {
            isLoading: isDeleteBookActionLoading,
            error: deleteBookActionError
        }
    ] = useDeleteBookFromCartMutation()

    // get toast utility functions for managing toasts 
    // on this page
    const { openToast } = useToastActions()
    
    // get dialog utility functions for managing dialogs 
    // on this page
    const { openDialog, closeDialog } = useDialogActions()
    
    // check if book with id is in user's cart and 
    // retrieve quantity in cart
    let bookDetails = user?.data?.cart?.find( function( book ) {
        return book.id === id
    })

    async function handleAddToCart() {
        try {
            await addBookToCart({
                book_id: id,
                quantity: 1
            }).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Book added to Cart"
            })

            // log the action of adding a book to the cart
            // using the app's dedicated logger
            logger.info(
                "Book added to user's cart",
                {
                    bookId: id,
                    requestId: user?.requestId,
                    userId: user?.data?.id
                }
            )
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error adding book to user's cart",
                error,
                {
                    bookId: id,
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            let dialogId = openDialog({
                title: "Cart Addition Error",
                description: `An error occured while trying to add
                this book to the cart. Error: ${getErrorMessage( addBookActionError || error)}`,
                render: function() {
                    return (
                        <Button
                            className="
                                block
                                w-full
                                mt-2
                            "
                            onClick={ function() {
                                closeDialog( dialogId )

                                handleAddToCart()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    async function handleIncreaseQuantity() {
        // perform a bounds check to ensure that the 
        // quantity of the book in the cart does not 
        // exceed the available stock
        if ( bookDetails.order_quantity + 1 > bookDetails.quantity ) {
            return openToast({
                type: ToastTypes.error,
                message: "Error: Cannot add more books to cart than available stock"
            })
        }

        try {
            await updateBookInCart({
                book_id: id,
                quantity: bookDetails.order_quantity + 1
            }).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Book quantity updated"
            })

            // log the action of updating the quantity of a 
            // book in the cart using the app's dedicated logger
            logger.info(
                "Book quantity updated in user's cart",
                {
                    bookId: id,
                    newQuantity: bookDetails.order_quantity + 1,
                    requestId: user?.requestId,
                    userId: user?.data?.id
                }
            )
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error updating book quantity in user's cart",
                error,
                {
                    bookId: id,
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            let dialogId = openDialog({
                title: "Cart Update Error",
                description: `An error occured while trying to update
                the quantity of this book in the cart. Error: ${
                    getErrorMessage( updateBookActionError || error)
                }`,
                render: function() {
                    return (
                        <Button
                            className="
                                block
                                w-full
                                mt-2
                            "
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleIncreaseQuantity()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    async function handleDecreaseQuantity() {
        // perform a bounds check to decide whether 
        // to update the quantity of the book in the cart 
        // or remove it from the cart
        if ( bookDetails.order_quantity - 1 <= 0 ) {
            // if the quantity of the book in the cart is 1,
            // then remove the book from the cart
            try {
                await deleteBookFromCart( id ).unwrap()

                openToast({
                    type: ToastTypes.success,
                    message: "Book removed from cart"
                })

                // log the action of removing a book from the
                // cart using the app's dedicated logger
                logger.info(
                    "Book removed from user's cart",
                    {
                        bookId: id,
                        requestId: user?.requestId,
                        userId: user?.data?.id
                    }
                )
            } catch( error ) {
                // log the error using the app's dedicated logger
                logger.error(
                    "Error removing book from user's cart",
                    error,
                    {
                        bookId: id,
                        requestId: error?.requestId,
                        userId: user?.data?.id
                    }
                )

                let dialogId = openDialog({
                    title: "Cart Update Error",
                    description: `An error occured while trying to remove
                    the book from the cart. Error: ${
                        getErrorMessage( deleteBookActionError || error)
                    }`,
                    render: function() {
                        return (
                            <Button
                                className="
                                    block
                                    w-full
                                    mt-2
                                "
                                onClick={ function() {
                                    closeDialog( dialogId )
                                    handleDecreaseQuantity()
                                }}
                            >
                                Retry
                            </Button>
                        )
                    }
                })
            }
        } else {
            // if the quantity of the book in the cart is greater than 1,
            // then update the quantity of the book in the cart
            try {
                await updateBookInCart({
                    book_id: id,
                    quantity: bookDetails.order_quantity - 1
                }).unwrap()
    
                openToast({
                    type: ToastTypes.success,
                    message: "Book quantity updated"
                })

                // log the action of updating the quantity of a 
                // book in the cart using the app's dedicated logger
                logger.info(
                    "Book quantity updated in user's cart",
                    {
                        bookId: id,
                        newQuantity: bookDetails.order_quantity - 1,
                        requestId: user?.requestId,
                        userId: user?.data?.id
                    }
                )
            } catch( error ) {
                // log the error using the app's dedicated logger
                logger.error(
                    "Error updating book quantity in user's cart",
                    error,
                    {
                        bookId: id,
                        requestId: error?.requestId,
                        userId: user?.data?.id
                    }
                )

                let dialogId = openDialog({
                    title: "Cart Update Error",
                    description: `An error occured while trying to update
                    the quantity of this book in the cart. Error: ${ 
                        error?.message ||
                        updateBookActionError.data?.error?.message
                    }`,
                    render: function() {
                        return (
                            <Button
                                className="
                                    block
                                    w-full
                                    mt-2
                                "
                                onClick={ function() {
                                    closeDialog( dialogId )
                                    handleDecreaseQuantity()
                                }}
                            >
                                Retry
                            </Button>
                        )
                    }
                })
            }
        }

    }

    const isCartActionLoading =
        isUpdateBookActionLoading ||
        isDeleteBookActionLoading ||
        isAddBookActionLoading;


    return <div
        className={`
            ${className}
        `}
    >
        { !bookDetails && 
            <Button
                className="
                    block
                    w-full
                "
                onClick={ handleAddToCart }
            >
                { !isAddBookActionLoading && <> Add to cart </> }
                { isAddBookActionLoading && <> Adding... </> }
            </Button>
        }

        { bookDetails && <div
            className="
                flex
                items-center
                gap-5
                justify-between
            "
        >
            <Button
                className="
                    px-2.5!
                    disabled:opacity-50
                "
                onClick={ handleDecreaseQuantity }
                disabled={ isCartActionLoading }
            >
                <FaMinus />
            </Button>

            <span
                className="
                    text-xl
                    font-medium
                "
            >
                { 
                    (
                        isUpdateBookActionLoading ||
                        isDeleteBookActionLoading
                    ) ?  
                    <FaCircleNotch
                        className="
                            animate-spin
                            text-gray-700
                            text-xl
                        "
                    /> :
                    bookDetails.order_quantity 
                }
            </span>

            <Button
                className="
                    px-2.5!
                    disabled:opacity-50
                "
                onClick={ handleIncreaseQuantity }
                disabled={ isCartActionLoading }
            >
                <FaPlus />
            </Button>
        </div>}
    </div>
}