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

export function Component() {
    const { data: user } = useGetMeQuery()
    
    const [ shippingAddress, setShippingAddress ] = useState("")

    const [ 
        checkout, 
        { 
            error: checkoutError,
            isLoading: isCheckoutLoading,
            isFetching: isCheckoutFetching
        } 
    ] = useCheckoutCartMutation()

    const { openDialog, closeDialog } = useDialogActions()

    const { openToast } = useToastActions()

    useEffect( function() {
        setShippingAddress( user?.data?.addresses[ 0 ] || "" )
    }, [user])

    if ( user?.data?.cart.length == 0 ) {
        return (
            <EmptyCartMessage />
        )
    }

    async function handleCheckout() {
        try {
            let { data: checkoutData } = await checkout( shippingAddress ).unwrap()

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

    function getDeliveryDate() {
        return new Date().toLocaleDateString('en-US', {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    return <div className="pb-12">
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

            <div>
                <h2
                    className="
                        text-2xl
                        lg:mt-2
                    "
                >
                    Order summary
                </h2>

                <InfoList
                    className="mt-5"
                    entries={{
                        "delivery date": `${ getDeliveryDate() }`,
                        "total payable": `$${ calculateCartTotal( user?.data?.cart )}`
                    }}
                />

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


