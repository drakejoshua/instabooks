import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setToken, logOut } from "../../features/users/authSlice.js"
import { authApi } from "../../features/users/services/authApi.js";

const backendURL = import.meta.env.VITE_BACKEND_URL
const LocalStorageAuthKey = import.meta.env.VITE_LOCALSTORAGE_AUTH_KEY

export const baseQuery = fetchBaseQuery({
    baseUrl: backendURL,
    credentials: "include",
    prepareHeaders: function( headers, { getState } ) {
        // fetch access token from localStorage or state
        const token = getState().auth.token || localStorage.getItem( LocalStorageAuthKey )

        if ( token ) {
            headers.set("Authorization", `Bearer ${ token }`)
        }

        return headers
    }
})

export const baseQueryWithRefreshAuth = async function( args, api, extraOptions ) {
    // make initial request
    let result = await baseQuery( args, api, extraOptions )

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

            // retry original request with new access token
            result = await baseQuery( args, api, extraOptions )
        } else {
            api.dispatch(logOut());
            api.dispatch(authApi.util.resetApiState());
        }
    }

    return result
}