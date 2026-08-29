import Intro from "../components/Intro";
import AltButton from "../../../shared/components/AltButton";
import { Link } from "react-router-dom";
import OrderDetails from "../components/OrderDetails";
import { useGetOrdersQuery } from "../services/adminApi";
import { useState } from "react";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";
import { FaArrowsRotate } from "react-icons/fa6";
import { logger } from "../../../infra/logging/logger";

export function Component() {
    // state to keep track of the current page for pagination
    const [ page, setPage ] = useState( 1 )

    // fetch the orders data using the useGetOrdersQuery hook
    let defaultLimit = 10;

    // fetch the orders data using the useGetOrdersQuery hook, 
    // passing the current page as a parameter
    const { 
        data: ordersData, 
        error, 
        isLoading, 
        isFetching,
        refetch
    } = useGetOrdersQuery(page)

    // handleLoadMore() - This function is called when the 
    // "Load more orders" button is clicked. It checks if there 
    // are more orders to load based on the current page and 
    // the total number of orders. If there are more orders, 
    // it increments the page state to fetch the next set of orders.
    function handleLoadMore() {
        if ( ( page * defaultLimit ) < ordersData?.data?.totalOrders ) {
            setPage( page + 1 )
        }
    }

    // show loading state while the orders data is being fetched
    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading orders..."
            />
        )
    }

    // show error state if there is an error while fetching the 
    // orders data
    if ( !isLoading && !isFetching && error ) {
        // log the error using the app's dedicated logger
        logger.error(
            "Error fetching orders for admin",
            error,
            {
                requestId: error?.requestId
            }
        );

        return (
            <RouteError
                heading="An error occurred while fetching orders"
                error={ error }
                refetch={ refetch }
                text={`
                    There was an error while fetching the orders. 
                    Please try again later. Error: 
                `}
                retryLoadingStatus={ isLoading || isFetching }
                buttonLabel="Retry"
            />
        )
    }

    // show empty state if there are no orders in the store
    if ( 
        !isLoading && !isFetching &&
        ordersData?.data?.orders?.length === 0
    ) {
        return (
            <p
                className="
                    text-center
                    opacity-50
                "
            >
                There are no orders on the store
            </p>
        )
    }

    return <div className="pb-12 lg:pb-8">
        {/* intro */}
        <Intro
            title="Manage orders"
        >
            {/* view books link */}
            <AltButton asChild>
                <Link to="/admin/books">
                    view books
                </Link>
            </AltButton>
        </Intro>

        {/* order management list */}
        <div 
            className="
                mt-8
                flex
                flex-col
                gap-4
            "
        >
            {
                // show the list of orders if there are orders in the store
                ordersData?.data?.orders?.map( function( order ) {
                    return (
                        <OrderDetails 
                            key={ order.id }
                            id={ order.id }
                            status={ order.status }
                            orderDate={ new Date( order.createdAt ) }
                            totalAmount={ order.price_at_purchase }
                            user={{
                                name: order.user_id?.name || "N/A",
                                email: order.user_id?.email || "N/A",
                            }}
                            paymentStatus={ order.payment_status }
                            shippingAddress={ order.shipping_address }
                            books={order.products.map(function( book ) {
                                    return {
                                        id: book.id,
                                        name: book.title,
                                        order_quantity: book.order_quantity,
                                        price: book.price,
                                        cover_photo_url: book.cover_photo_url
                                    }
                                })
                            }
                        />
                    )
                })
            }
        </div>

        {/* load more button */}
        {
            ordersData?.data?.totalOrders > (page * defaultLimit) &&
            <AltButton
                className="
                    flex!
                    items-center
                    gap-4
                    mx-auto
                    mt-8 lg:mt-12
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    group
                "
                disabled={ isFetching }
                onClick={ handleLoadMore }
            >
                <FaArrowsRotate 
                    className="
                        text-xl
                        group-disabled:animate-spin
                    "
                />
                
                Load more orders
            </AltButton>
        }
    </div>;
}