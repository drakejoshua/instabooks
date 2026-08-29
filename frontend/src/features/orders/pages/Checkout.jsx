import OrderDetailsItem from "../../../shared/components/OrderDetailsItem";
import { ToggleGroup } from 'radix-ui'
import Button from "../../../shared/components/Button";
import { InfoList } from "../../../shared/components/InfoList";
import { useGetMeQuery } from "../../users/services/authApi";
import EmptyCartMessage from "../components/EmptyCartMessage";
import { calculateCartTotal } from "../utils/utils";
import { useEffect, useState } from "react";
import { useCheckoutCartMutation } from "../../../shared/services/ordersApi";
import { useDialogActions } from "../../../shared/ui/DialogRenderer";
import { getErrorMessage } from "../../../shared/utils/utils";
import { ToastTypes, useToastActions } from "../../../shared/ui/ToastRenderer";
import { trackBeginCheckout } from "../../../infra/analytics/ecommerce";
import { logger } from "../../../infra/logging/logger";


// Checkout page - displays the checkout process for the user's cart, 
// including order confirmation, shipping information, and order summary. 
// It allows the user to select a shipping address and proceed to payment.


export function Component() {
    // get user information through the redux query 
    // or from rtk cache
    const { data: user } = useGetMeQuery()
    
    // state to hold the selected shipping address
    const [ shippingAddress, setShippingAddress ] = useState("")

    // checkout mutation hook from the ordersApi service
    const [ 
        checkout, 
        { 
            error: checkoutError,
            isLoading: isCheckoutLoading,
            isFetching: isCheckoutFetching
        } 
    ] = useCheckoutCartMutation()

    // dialog actions for opening and closing dialogs from this
    // page to alert the user of errors or important information
    const { openDialog, closeDialog } = useDialogActions()

    // toast actions for opening and closing toast notifications from this
    // page to alert the user of success or error messages
    const { openToast } = useToastActions()

    // set the default shipping address to the first address in the 
    // user's address book if any
    useEffect( function() {
        setShippingAddress( user?.data?.addresses[ 0 ] || "" )
    }, [user])

    // if the user's cart is empty, display an empty cart message
    if ( user?.data?.cart.length == 0 ) {
        return (
            <EmptyCartMessage />
        )
    }

    // handleCheckout()
    // This function is called when the user clicks the "Pay Now" button. 
    // It attempts to checkout the user's cart using the selected shipping 
    // address. If successful, it opens a success toast and redirects the 
    // user to the payment page. If there is an error, it logs the error 
    // and opens a dialog with an option to retry the checkout process.
    async function handleCheckout() {
        try {
            // checkout the user's cart with the selected shipping address
            let { data: checkoutData } = await checkout( shippingAddress ).unwrap()

            // open a success toast notification to inform the user that
            // the checkout was successful and they will be redirected to 
            // the payment page shortly
            openToast({
                type: ToastTypes.success,
                message: `
                    Cart checked out successfully. You will be 
                    redirected to the payment page shortly.
                `
            })

            // send begin checkout event to google analytics
            trackBeginCheckout( {
                currency: "USD",
                total: calculateCartTotal( user?.data?.cart ),
                items: user?.data?.cart.map( function(book) {
                    return {
                        id: book.id,
                        title: book.title,
                        price: book.price,
                        quantity: book.order_quantity || 1
                    }
                })
            })

            // redirect the user to the payment page after a short 
            // delay to allow them to read the success message
            setTimeout(function() {
                window.location.href = checkoutData.authorization_url
            }, 1000)
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error checking out user's cart",
                error,
                {
                    requestId: error?.requestId,
                    userId: user?.data?.id,
                }
            );

            // open a dialog to inform the user that there was an error
            // while checking out their cart and provide an option to retry
            let dialogId = openDialog({
                title: "Cart checkout error",
                description: `
                    There was an error while checking out 
                    your cart. Please try again later. Error: ${ 
                        getErrorMessage( checkoutError || error ) 
                    }
                `,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )

                                handleCheckout()
                            }}
                            className="
                                w-full
                                mt-4
                            "
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    // getDeliveryDate()
    // This function returns the estimated delivery date for the order 
    // based on the current date. It formats the date in a human-readable 
    // format (e.g., "Jan 1, 2024").
    function getDeliveryDate() {
        return new Date().toLocaleDateString('en-US', {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    return <div className="pb-12">
        {/* checkout heading */}
        <h1
            className="
                text-4xl
                capitalize
                mt-4 lg:mt-0
            "
        >
            checkout
        </h1>

        {/* checkout details */}
        <div
            className="
                mt-8
                grid
                grid-cols-1 lg:grid-cols-[3fr_1fr]
                gap-12
            "
        >
            <div>
                {/* confirmation and shipping info */}
                <div>
                    <h2
                        className="
                            text-2xl
                        "
                    >
                        1. Order confirmation
                    </h2>

                    {/* book list */}
                    <div
                        className="
                            mt-5
                        "
                    >
                        { user?.data?.cart.map(function( book ) {
                            return (
                                <OrderDetailsItem
                                    key={ book.id }
                                    bookName={ book.title }
                                    quantity={ book.order_quantity }
                                    price={ book.price }
                                    photoUrl={ book.cover_photo_url }
                                />
                            )
                        })}
                    </div>
                </div>

                {/* order summary */}
                <div 
                    className="
                        mt-8
                    "
                >
                    <h2
                        className="
                            text-2xl
                            capitalize
                        "
                    >
                        2. shipping information
                    </h2>

                    {
                        // if the user has saved addresses, display a toggle 
                        // group to select a shipping address
                        user?.data?.addresses?.length > 0 && <>
                            <div
                            className="
                                mt-3
                            "
                        >
                            <p
                                className="
                                    mt-6
                                "
                            >
                                Choose shipping address: 
                            </p>

                            <ToggleGroup.Root 
                                type="single"
                                value={ shippingAddress }
                                className="
                                    flex
                                    gap-2
                                    mt-6 lg:mt-4
                                    flex-wrap
                                    
                                    *:data-[state=on]:outline-2
                                    *:data-[state=on]:outline-instabooks-blue
                                    *:p-4
                                    *:rounded-md
                                    *:cursor-pointer
                                    *:transition
                                    *:focus-visible:outline-2
                                    *:focus-visible:outline-instabooks-blue
                                    *:focus-visible:outline-offset-2
                                "
                                onValueChange={ (newValue) => newValue ? setShippingAddress( newValue ) : shippingAddress }
                            >
                                {
                                    // map through the user's saved addresses and render a 
                                    // ToggleGroup.Item for each address
                                    user?.data?.addresses.map( function( address ) {
                                        return (
                                            <ToggleGroup.Item
                                                value={ address }
                                            >
                                                { address }
                                            </ToggleGroup.Item>
                                        )
                                    })
                                }
                            </ToggleGroup.Root>
                            </div>

                            <h3
                                className="
                                    capitalize
                                    text-xl
                                    mt-6
                                "
                            >
                                standard free delivery
                            </h3>
                            
                            <InfoList
                                className="mt-4"
                                entries={{
                                    "delivery date": getDeliveryDate(),
                                    "delivery fee": "$0"
                                }}
                            />
                        </>
                    }

                    {
                        // if the user has no saved addresses, display a message
                        // informing them to add an address in their profile before checking out
                        user?.data?.addresses?.length == 0 && <p
                            className="
                                mt-6
                            "
                        >
                            You don't have any saved addresses. Please 
                            add an address in your profile before 
                            checking out your cart.
                        </p>
                    }
                </div>
            </div>

            {/* order summary and checkout button */}
            <div>
                <h2
                    className="
                        text-2xl
                        lg:mt-2
                    "
                >
                    Order summary
                </h2>

                {/* order total and deliery information */}
                <InfoList
                    className="mt-5"
                    entries={{
                        "delivery date": `${ getDeliveryDate() }`,
                        "total payable": `$${ calculateCartTotal( user?.data?.cart )}`
                    }}
                />

                {/* checkout button */}
                <Button
                    className="
                        mt-12 lg:mt-8
                        capitalize
                        w-full md:w-1/2 lg:w-full
                        mx-auto
                        block
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                    disabled={ 
                        isCheckoutLoading || 
                        isCheckoutFetching ||
                        user?.data?.addresses?.length == 0
                    }
                    onClick={ handleCheckout }
                >
                    {
                        ( isCheckoutLoading || isCheckoutFetching ) ? "processing..." : "pay now"
                    }
                </Button>
            </div>
        </div>
    </div>;
}


