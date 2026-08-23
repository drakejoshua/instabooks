import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, setToken } from "../../features/users/authSlice.js"

const backendURL = import.meta.env.VITE_BACKEND_URL
const LocalStorageAuthKey = import.meta.env.VITE_LOCALSTORAGE_AUTH_KEY

// pendingRefresh is used to prevent multiple refresh 
// requests from being sent simultaneously. If a refresh 
// request is already in progress, subsequent requests 
// will wait for the first one to complete and use its 
// result.
let pendingRefresh = null

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
        
        // check if there's a pending refresh and instantiate
        // a new refresh request if none
        if (!pendingRefresh) {
            pendingRefresh = baseQuery(
                {
                    url: "/auth/refresh",
                    method: "POST",
                },
                api,
                extraOptions
            ).finally(() => {
                // cleanup the value of the pending refresh when 
                // the request is finally done
                pendingRefresh = null;
            });
        }

        // get the value of the pending refresh request and
        // await it to get the results  
        const refreshResult = await pendingRefresh;

        // proceed with the refresh result
        if ( refreshResult.data ) {
            let accessToken = refreshResult.data.data.access_token

            api.dispatch(
                setToken( accessToken )
            )

            // retry original request with new access token
            result = await baseQuery( args, api, extraOptions )
        } else {
            api.dispatch(clearToken());
        }
    }

    return result
}

export const baseQueryWithAdminAuth = fetchBaseQuery({
    baseUrl: backendURL,
    prepareHeaders: function( headers, _ ) {
        // get admin access key from env variables
        let adminKey = import.meta.env.VITE_INSTABOOKS_ADMIN_KEY

        // use admin key for admin-related operations/endpoints
        headers.set( "Authorization", `Bearer ${adminKey}` )

        return headers
    }
})