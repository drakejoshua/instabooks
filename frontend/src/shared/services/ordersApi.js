import { authApi } from "../../features/users/services/authApi"
import { baseApi } from "../../app/services/baseApi"


// ordersApi
// This is a service that provides endpoints for managing 
// orders in the application. It uses the baseApi service 
// to define the endpoints and their corresponding queries 
// and mutations. The service includes endpoints for fetching 
// orders, fetching a specific order, checking out the cart, 
// revalidating an order, and canceling an order. It also handles 
// updating the Redux store with the latest order data and 
// invalidating cache tags when necessary.


export const ordersApi =  baseApi.injectEndpoints({
    endpoints: function( builder ) {
        return {
            // getOrders endpoint - fetches a list of orders with 
            // pagination support
            getOrders: builder.query({
                query: function({ limit, page }) {
                    return {
                        url: "/orders",
                        params: { limit, page }
                    }
                },
                providesTags: ["orders"]
            }),
            // getOrder endpoint - fetches the details of a specific
            // order by its ID
            getOrder: builder.query({
                query: function( order_id ) {
                    return {
                        url: `/orders/${ order_id }`,
                    }
                }
            }),
            // checkoutCart endpoint - performs the checkout process
            // for the user's cart by sending the shipping address to 
            // the backend API. It also updates the Redux store to 
            // clear the cart after a successful checkout.
            checkoutCart: builder.mutation({
                query: function( shipping_address ) {
                    return {
                        url: "/orders/checkout",
                        method: "POST",
                        body: {
                            shipping_address
                        }
                    }
                },
                onQueryStarted: async function(
                    _,
                    api
                ) {
                    await api.queryFulfilled

                    // update the Redux store to clear the user's
                    // cart after a successful checkout
                    api.dispatch(
                        authApi.util.updateQueryData(
                            "getMe",
                            undefined,
                            function( draft ) {
                                draft.data.cart = []
                            }
                        )
                    )
                }
            }),
            // revalidateOrder endpoint - revalidates the status of a specific
            // order by its ID. It updates the Redux store to set the
            // order status to "pending" after a successful revalidation.
            revalidateOrder: builder.mutation({
                query: function( order_id ) {
                    return {
                        url: `/orders/revalidate/${ order_id }`,
                        method: "GET"
                    }
                },
                async onQueryStarted(
                    order_id,
                    api
                ) {
                    await api.queryFulfilled

                    api.dispatch(
                        ordersApi.util.updateQueryData(
                            "getOrder",
                            order_id,
                            function( draft ) {
                                draft.data.status = "pending"
                            }
                        )
                    )
                },
                invalidatesTags: ["orders"]
            }),
            // cancelOrder endpoint - cancels a specific order by its ID.
            // It updates the Redux store to set the order status to 
            // "cancelled" after a successful cancellation.
            cancelOrder: builder.mutation({
                query: function( order_id ) {
                    return {
                        url: `/orders/${ order_id }`,
                        method: "DELETE",
                    }
                },
                onQueryStarted: async function(
                    order_id,
                    api
                ) {
                    await api.queryFulfilled

                    api.dispatch(
                        ordersApi.util.updateQueryData(
                            "getOrder",
                            order_id,
                            function( draft ) {
                                draft.data.status = "cancelled"
                            }
                        )
                    )
                },
                invalidatesTags: ["orders"]
            })
        }
    }
})

// export hooks for the endpoints defined in the 
// ordersApi service.
export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useCheckoutCartMutation,
    useCancelOrderMutation,
    useRevalidateOrderMutation
} = ordersApi