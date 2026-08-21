import Intro from "../components/Intro";
import AltButton from "../../../shared/components/AltButton";
import { Link } from "react-router-dom";
import OrderDetails from "../components/OrderDetails";
import { useGetOrdersQuery } from "../services/adminApi";
import { useState } from "react";
import RouteLoading from "../../../shared/ui/RouteLoading";
import RouteError from "../../../shared/ui/RouteError";
import { FaArrowsRotate } from "react-icons/fa6";

export function Component() {
    const [ page, setPage ] = useState( 1 )
    let defaultLimit = 10;
    const { 
        data: ordersData, 
        error, 
        isLoading, 
        isFetching,
        refetch
    } = useGetOrdersQuery(page)

    function handleLoadMore() {
        if ( ( page * defaultLimit ) < ordersData?.data?.totalOrders ) {
            setPage( page + 1 )
        }
    }

    if ( isLoading ) {
        return (
            <RouteLoading
                label="loading orders..."
            />
        )
    }

    if ( !isLoading && !isFetching && error ) {
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