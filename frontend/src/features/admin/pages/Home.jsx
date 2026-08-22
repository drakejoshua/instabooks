import { useState } from "react";
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

export function Component() {
    const [ page, setPage ] = useState( 1 )
    const {
        data: booksData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetBooksQuery( page )
    const defaultLimit = 10

    const [
        createBook,
        {
            isLoading: isCreatingBook,
            isFetching: isBookCreationFetching
        }
    ] = useCreateBookMutation()

    const [ 
        isCreateBookDialogOpen, 
        setIsCreateBookDialogOpen
    ] = useState( false )
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

    const { openToast } = useToastActions()
    
    const { openDialog, closeDialog } = useDialogActions()


    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading store books..."
            />
        )
    }

    if ( !isLoading && !isFetching && error ) {
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

    function handleLoadMore() {
        if ( booksData?.data?.totalBooks > ( page * defaultLimit ) ) {
            setPage( prev => prev + 1 )
        }
    }

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

    async function handleCreateBookSubmit( e ) {
        e?.preventDefault()

        try {
            await createBook( newBookDetails ).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Book created successfully"
            })

            closeCreateBookDialog()
        } catch( error ) {
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
                <Button
                    onClick={ () => setIsCreateBookDialogOpen( true ) }
                >
                    Add new book
                </Button>

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