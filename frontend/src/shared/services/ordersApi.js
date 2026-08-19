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
            })
        }
    }
})

export const {
    useGetOrdersQuery
} = ordersApi