import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRefreshAuth } from "../../../app/store/baseQuery"

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
            })
        }
    }
})


export const {
    useGoogleVerifyQuery,
    useGetMeQuery
} = authApi