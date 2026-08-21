import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRefreshAuth } from "../../../app/store/baseQuery.js"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithRefreshAuth,
    tagTypes: ["user"],
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
                query: () => "/auth/me",
                providesTags: ["user"]
            }),
            logout: builder.mutation({
                query: () => ({
                    url: "/auth/logout",
                    method: "GET"
                })
            }),
            updateUser: builder.mutation({
                query: function({ name, photo, delete_photo = false }) {
                    let newUserInfo = new FormData()

                    if ( name ) newUserInfo.append("name", name)
                    if ( photo ) newUserInfo.append("photo", photo)

                    return {
                        url: `/auth/update?deletePhoto=${ delete_photo }`,
                        method: "POST",
                        body: newUserInfo
                    }
                },
                invalidatesTags: ["user"]
            })
        }
    }
})


export const {
    useGoogleVerifyQuery,
    useGetMeQuery,
    useLogoutMutation,
    useUpdateUserMutation
} = authApi