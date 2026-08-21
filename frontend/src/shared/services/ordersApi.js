import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRefreshAuth } from "../../app/store/baseQuery"
import { authApi } from "../../features/users/services/authApi"

export const ordersApi = createApi({
    reducerPath: "orders",
    baseQuery: baseQueryWithRefreshAuth,
    tagTypes: ["orders"],
    endpoints: function( builder ) {
        return {
            getOrders: builder.query({
                query: function({ limit, page }) {
                    return {
                        url: "/orders",
                        params: { limit, page }
                    }
                },
                providesTags: ["orders"]
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
                },
                onQueryStarted: async function(
                    _,
                    api
                ) {
                    await api.queryFulfilled

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

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useCheckoutCartMutation,
    useCancelOrderMutation,
    useRevalidateOrderMutation
} = ordersApi