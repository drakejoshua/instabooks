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
    const [ 
        revalidateOrder, 
        { 
            isLoading: isRevalidatingLoading,
            isFetching: isRevalidatingFetching,
            error: revalidateError
        } 
    ] = useRevalidateOrderMutation()
    const [ 
        cancelOrder, 
        { 
            isLoading: isCancellingLoading,
            isFetching: isCancellingFetching,
            error: cancelError
        } 
    ] = useCancelOrderMutation()

    const { data } = useGetMeQuery();

    const { openDialog, closeDialog } = useDialogActions()
    
    const { openToast } = useToastActions()

    async function handleOrderRevalidation() {
        try {
            const { data: revalidationData } = await revalidateOrder( orderId ).unwrap()

            openToast({
                type: "success",
                message: `
                    Order revalidated successfully. You will be 
                    redirected to the payment page shortly.
                `
            })

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

    async function handleOrderCancellation() {
        try {
            await cancelOrder( orderId ).unwrap()

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

    function confirmOrderDeletion() {
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
                    

                    <span
                        className="
                            font-medium
                            text-lg
                        "
                    >
                        Order ID: #{ orderId }
                    </span>

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