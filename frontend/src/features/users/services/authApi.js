import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRefreshAuth } from "../../../app/store/baseQuery.js"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithRefreshAuth,
    endpoints: function( builder ) {
        return {
            googleVerify: builder.query({
                query: ( id ) => ({
                    url: "/auth/google/verify",
                    params: {
                        authId: id
                    }
                })
            }),
            getMe: builder.query({
                query: () => "/auth/me"
            }),
            logout: builder.mutation({
                query: () => ({
                    url: "/auth/logout",
                    method: "GET"
                })
            })
        }
    }
})


export const {
    useGoogleVerifyQuery,
    useGetMeQuery,
    useLogoutMutation
} = authApi