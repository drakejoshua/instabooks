import { Collapsible } from "radix-ui";
import { FaArrowsRotate, FaChevronUp, FaTrash } from "react-icons/fa6";
import { InfoList } from "../../../shared/components/InfoList";
import OrderDetailsItem from "../../../shared/components/OrderDetailsItem";
import Button from "../../../shared/components/Button";
import AltButton from "../../../shared/components/AltButton";
import Badge from "../../../shared/components/Badge";
import { useCancelOrderMutation, useRevalidateOrderMutation } from "../../../shared/services/ordersApi";
import { ToastTypes, useToastActions } from "../../../shared/ui/ToastRenderer";
import { useDialogActions } from "../../../shared/ui/DialogRenderer";
import { getErrorMessage } from "../../../shared/utils/utils";
import { useGetMeQuery } from "../services/authApi";
import { logger } from "../../../infra/logging/logger";


// OrderPreview component 
// This component displays a summary of an order, including its 
// ID, status, shipping address, order date, delivery date, total 
// paid, payment status, and a list of ordered items. It also 
// provides buttons for revalidating or cancelling the order, 
// with appropriate loading states and error handling.


export function OrderPreview({ 
    orderId, 
    status, 
    shippingAddress, 
    orderDate, 
    deliveryDate, 
    totalPaid, 
    paymentStatus,
    items
}) {
    // revalidateOrder and useRevalidateOrderMutation hook to revalidate
    // orders and redirect the user to the payment page.
    const [ 
        revalidateOrder, 
        { 
            isLoading: isRevalidatingLoading,
            isFetching: isRevalidatingFetching,
            error: revalidateError
        } 
    ] = useRevalidateOrderMutation()

    // cancelOrder and useCancelOrderMutation hook to cancel orders and
    // handle the loading and error states during the cancellation process.
    const [ 
        cancelOrder, 
        { 
            isLoading: isCancellingLoading,
            isFetching: isCancellingFetching,
            error: cancelError
        } 
    ] = useCancelOrderMutation()

    // get the authenticated user data using the useGetMeQuery hook
    const { data } = useGetMeQuery();

    // dialog actions to display and manage dialogs for
    // showing alert messages and confirmation prompts
    const { openDialog, closeDialog } = useDialogActions()
    
    // toast actions to display and manage toast notifications for
    // showing success or error messages to the user
    const { openToast } = useToastActions()

    // handleOrderRevalidation()
    // This function is called when the user clicks the 
    // "Revalidate Order" button. It attempts to revalidate 
    // the order by calling the revalidateOrder mutation. 
    // If successful, it shows a success toast and redirects 
    // the user to the payment page. If an error occurs, it 
    // logs the error and displays a dialog with an option 
    // to retry the revalidation.
    async function handleOrderRevalidation() {
        try {
            // call the revalidateOrder mutation and unwrap 
            // the result to get the revalidation data
            const { data: revalidationData } = await revalidateOrder( orderId ).unwrap()

            // show a success toast notification to the user since 
            // revalidation was successful
            openToast({
                type: "success",
                message: `
                    Order revalidated successfully. You will be 
                    redirected to the payment page shortly.
                `
            })

            // redirect the user to the payment page after a short delay
            setTimeout(function() {
                window.location.href = revalidationData?.authorization_url
            }, 1000 )
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error revalidating order for user",
                error,
                {
                    orderId: orderId,
                    requestId: error?.requestId,
                    userId: data?.data?.id
                }
            )

            // show a dialog to the user with an error message and an 
            // option to retry the revalidation
            let dialogId = openDialog({
                title: "Order revalidation error",
                description: `
                    There was an error revalidating your order, 
                    please try again. Error: ${
                        getErrorMessage( revalidateError || error )
                    }
                `,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleOrderRevalidation()
                            }}
                            className="
                                w-full
                                mt-4
                            "
                        >
                            retry
                        </Button>
                    )
                }
            })
        }
    }

    // handleOrderCancellation()
    // This function is called when the user clicks the "Cancel Order" 
    // button. It attempts to cancel the order by calling the cancelOrder 
    // mutation. If successful, it shows a success toast notification. 
    // If an error occurs, it logs the error and displays a dialog with 
    // an option to retry the cancellation.
    async function handleOrderCancellation() {
        try {
            // call the cancelOrder mutation and unwrap the result to get
            // the cancellation data
            await cancelOrder( orderId ).unwrap()

            // show a success toast notification to the user since
            // cancellation was successful
            openToast({
                type: ToastTypes.success,
                message: "Order cancelled successfully"
            })
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error cancelling order for user",
                error,
                {
                    orderId: orderId,
                    requestId: error?.requestId,
                    userId: data?.data?.id
                }
            )

            // show a dialog to the user with an error message and an 
            // option to retry the cancellation
            let dialogId = openDialog({
                title: "Order cancellation error",
                description: `
                    There was an error cancelling your order, 
                    please try again. Error: ${
                        getErrorMessage( cancelError || error )
                    }
                `,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleOrderCancellation()
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

    // confirmOrderDeletion()
    // This function is called when the user clicks the "Cancel Order" 
    // button. It opens a confirmation dialog asking the user to confirm 
    // the cancellation of the order. If the user confirms, it calls the 
    // handleOrderCancellation function to proceed with the cancellation.
    function confirmOrderDeletion() {
        // open a confirmation dialog asking the user to confirm the 
        // order cancellation and proceed with the cancellation if confirmed
        let dialogId = openDialog({
            title: "Confirm order cancellation",
            description: `
                Are you sure you want to cancel this order? 
                This action cannot be undone.
            `,
            render: function() {
                return (
                    <Button
                        onClick={ function() {
                            closeDialog( dialogId )
                            handleOrderCancellation()
                        }}
                        className="
                            w-full
                            mt-4
                        "
                    >
                        Yes, Cancel order
                    </Button>
                )
            }
        })
    }

    let isRevalidating = isRevalidatingLoading || isRevalidatingFetching
    let isCancelling = isCancellingLoading || isCancellingFetching

    return (
        <Collapsible.Root>
            <div
                className="
                    bg-gray-100
                    p-5 py-6
                    rounded-xl
                "
            >
                {/* order id and status */}
                <Collapsible.Trigger
                    className="
                        flex
                        items-center
                        gap-3
                        w-full
                        group
                    "
                >
                    <FaChevronUp 
                        className="
                            group-data-[state=open]:rotate-0
                            transition-transform
                            duration-300
                            group-data-[state=closed]:rotate-180
                        "
                    />
                    
                    {/* order id */}
                    <span
                        className="
                            font-medium
                            text-lg
                        "
                    >
                        Order ID: #{ orderId }
                    </span>

                    {/* order status */}
                    <Badge
                        className="
                            ml-auto
                        "
                    >
                        { status }
                    </Badge>
                </Collapsible.Trigger>

                {/* shipping address */}
                <p
                    className="
                        mt-1
                    "
                >
                    { shippingAddress }
                </p>

                <Collapsible.Content>
                    {/* order metadata */}
                    <InfoList 
                        entries={{
                            "order date": orderDate,
                            "delivery date": deliveryDate,
                            "total paid": totalPaid,
                            "payment status": paymentStatus
                        }}
                        className="mt-4"
                    />

                    {/* order items */}
                    <div
                        className="
                            mt-4
                        "
                    >
                        {
                            // map through the order items and render an OrderDetailsItem
                            // for each item in the order
                            items.map((item) => (
                                <OrderDetailsItem
                                    key={ item.id }
                                    bookName={ item.title }
                                    quantity={ item.quantity }
                                    price={ item.price }
                                    photoUrl={ item.photoUrl }
                                />
                            ))
                        }
                    </div>

                    {/* order actions */}
                    <div 
                        className="
                            flex
                            gap-3
                            mt-12
                            flex-wrap

                            *:flex
                            *:items-center
                            *:gap-3
                            *:capitalize
                            *:px-4 *:py-2
                        "
                    >
                        { 
                            // allow users to revalidate the order only if the 
                            // payment status is not "paid" and the order 
                            // status has not been "cancelled"
                            (
                                paymentStatus != "paid" &&
                                status != "cancelled"
                            ) && 
                            <Button 
                                onClick={ handleOrderRevalidation } 
                                disabled={ isRevalidating }
                                className={ isRevalidating ? "opacity-50 cursor-not-allowed" : "" }
                            >
                                <FaArrowsRotate className={isRevalidating ? 'animate-spin' : ''}/>

                                { isRevalidating ? "revalidating..." : "revalidate order" }
                            </Button>
                        }

                        { 
                            // allow users to cancel the order only if the 
                            // payment status is not "paid" and the order 
                            // status has not been "cancelled"
                            status != "cancelled"  && 
                            <AltButton
                                onClick={ confirmOrderDeletion }
                                disabled={ isCancelling || isRevalidating }
                                className={ isRevalidating ? "opacity-50 cursor-not-allowed" : "" }
                            >
                                <FaTrash className={ isCancelling ? 'animate-spin' : ''}/>

                                { isCancelling ? "cancelling..." : "cancel order" }
                            </AltButton>
                        }
                    </div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    )
}