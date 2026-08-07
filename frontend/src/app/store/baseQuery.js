import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setToken, logOut } from "../../features/users/authSlice.js"

const backendURL = import.meta.env.VITE_BACKEND_URL

export const baseQuery = fetchBaseQuery({
    baseUrl: backendURL,
    credentials: "include",
    prepareHeaders: function( headers, { getState } ) {
        // fetch access token from localStorage or state
        const token = getState().auth.token || localStorage.getItem("instabooks-auth-token")

        if ( token ) {
            headers.set("Authorization", `Bearer ${ token }`)
        }

        return headers
    }
})

export const baseQueryWithRefreshAuth = async function( args, api, extraOptions ) {
    // make initial request
    let result = baseQuery( args, api, extraOptions )

    // if access token expired
    if ( result.error?.status === 401 ) {
        // refresh access token
        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "POST"
            },
            api,
            extraOptions
        )

        if ( refreshResult.data ) {
            let accessToken = refreshResult.data.data.access_token

            api.dispatch(
                setToken( accessToken )
            )

            // update localstorage with new access token
            localStorage.setItem("instabooks-auth-token", accessToken )

            // retry original request with new access token
            result = await baseQuery( args, api, extraOptions )
        } else {
            api.dispatch(
                logOut()
            )
        }
    }

    return result
}