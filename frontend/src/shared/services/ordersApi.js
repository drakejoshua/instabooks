import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRefreshAuth } from "../../app/store/baseQuery"

export const ordersApi = createApi({
    reducerPath: "orders",
    baseQuery: baseQueryWithRefreshAuth,
    endpoints: function( builder ) {
        return {
            getOrders: builder.query({
                query: function({ limit, page }) {
                    return {
                        url: "/orders",
                        method: "GET",
                        params: { limit, page }
                    }
                }
            }),
            getOrder: builder.query({
                query: function( order_id ) {
                    return {
                        url: `/orders/${ order_id }`,
                    }
                }
            }),
            checkoutCart: builder.mutation({
                query: function( shipping_address ) {
                    return {
                        url: "/orders/checkout",
                        method: "POST",
                        body: {
                            shipping_address
                        }
                    }
                }
            }),
            revalidateOrder: builder.query({
                query: function( order_id ) {
                    return {
                        url: `/orders/revalidate/${ order_id }`
                    }
                }
            }),
            confirmOrder: builder.query({
                query: function( order_id ) {
                    return {
                        url: '/orders/confirm',
                        params: {
                            reference: order_id
                        }
                    }
                }
            }),
            cancelOrder: builder.mutation({
                query: function( order_id ) {
                    return {
                        url: `/orders/${ order_id }`,
                        method: "DELETE",
                    }
                }
            })
        }
    }
})

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useConfirmOrderQuery,
    useCheckoutCartMutation,
    useCancelOrderMutation,
    useRevalidateOrderQuery
} = ordersApi