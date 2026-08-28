import { Link, useParams } from "react-router-dom"
import Button from "../../../shared/components/Button"
import { FaArrowLeft, FaArrowRotateRight, FaCircleNotch } from "react-icons/fa6"
import AnimatedCheckIcon from "../../../shared/components/AnimatedCheckIcon.jsx"
import AnimatedWarningIcon from "../../../shared/components/AnimatedWarningIcon.jsx"
import Heading from "../../../shared/components/Heading.jsx"
import OrderDetailsItem from "../../../shared/components/OrderDetailsItem.jsx"
import { useGetOrderQuery } from "../../../shared/services/ordersApi.js"
import { getErrorMessage } from "../../../shared/utils/utils.js"
import { useGetMeQuery } from "../../users/services/authApi.js"
import { logger } from "../../../infra/logging/logger.js"

export function Component() {
    const { id } = useParams()

    const { data: user } = useGetMeQuery();

    const { 
        data: orderConfirmationData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetOrderQuery( id )

    let iconStyle = `
        text-6xl
        block
        mx-auto
        mt-16
        text-instabooks-blue
    `;

    let buttonStyle = `
        mt-10
        mx-auto
        flex!
        w-fit
        gap-2
        items-center
        capitalize
    `;

    if ( error ) {
        // log the error using the app's dedicated logger
        logger.error(
            "Error fetching order details for user",
            error,
            {
                orderId: id,
                requestId: error?.requestId,
                userId: user?.data?.id
            }
        );
    }

    return <div
        className="
            w-full
            max-w-lg
            mx-auto
            px-6 pb-4 lg:px-2
        "
    >
        {/* loading state */}
        { ( isLoading || isFetching ) && <div>
            <FaCircleNotch className={iconStyle + "animate-spin"} />

            <Heading variant="route">
                We're fetching your order information
            </Heading>

            <p
                className="
                    text-center
                    mt-4
                "
            >
                If your confirmation isn't completed within a few 
                seconds, please check your internet connection and 
                try again.
            </p>
        </div>}
        
        {/* error state */}
        { error && <div>
            <AnimatedWarningIcon />

            <Heading variant="route">
                Error verifying the order ID: #{ id }
            </Heading>

            <p
                className="
                    text-center
                    mt-4
                "
            >
                Please check your internet connection and try again.
                You can try fetching your order information again
                by clicking the button below. Error: { 
                    getErrorMessage( error ) 
                }
            </p>

            <Button
                className={ buttonStyle }
                onClick={ () => refetch() }
            >
                <FaArrowRotateRight />
                refresh order information
            </Button>
        </div>}

        {/* loaded state */}
        { 
            (
                !isLoading && !isFetching && 
                !error && orderConfirmationData?.data
            ) && 
            <div>
                {
                    orderConfirmationData?.data?.status === "shipped" ?
                        <AnimatedCheckIcon 
                            className="mt-2!"
                        />
                    :
                        <AnimatedWarningIcon
                            className="mt-2!"
                        />
                }

                <Heading variant="route">
                    Order ID details: #{ id }
                </Heading>

                <p
                    className="
                        text-center
                        mt-4
                    "
                >
                    Your order status is: { orderConfirmationData?.data?.status } and 
                    is expected to be delivered on: { 
                        new Date(orderConfirmationData?.data?.createdAt)
                            .toLocaleDateString("en-US", {
                                day: "numeric",
                                year: "numeric",
                                month: "long",
                            })
                    }
                </p>

                <div
                    className="
                        mt-4
                        rounded-lg
                        p-3
                        bg-gray-100
                        max-h-48
                        overflow-y-auto
                    "
                >
                    {
                        orderConfirmationData?.data?.products?.map( function(book) { 
                            return (
                                <OrderDetailsItem 
                                    key={ book.id }
                                    bookName={ book.title }
                                    quantity={ book.order_quantity }
                                    price={ book.price }
                                    photoUrl={ book.cover_photo_url }
                                />
                            )
                        })
                    }
                </div>

                <Button
                    className={ buttonStyle }
                    asChild
                >
                    <Link to="/">
                        <FaArrowLeft />
                        <span>
                            Go back to home
                        </span>
                    </Link>
                </Button>
            </div>
        }
    </div>
}
