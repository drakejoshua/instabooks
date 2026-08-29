import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, setToken } from "../../features/users/authSlice.js"
import { getClientId } from "../../infra/analytics/GoogleAnalytics.js";

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
    prepareHeaders: async function( headers, { getState } ) {
        // fetch access token from localStorage or state
        const token = getState().auth.token || localStorage.getItem( LocalStorageAuthKey )

        // get client ID from Google Analytics ( or use mock value in development )
        const clientId = await getClientId() 

        // generate request id to be used for logging and 
        // debugging purposes
        const requestId = crypto.randomUUID()

        // set the Authorization header with the access token if it exists
        if ( token ) {
            headers.set("Authorization", `Bearer ${ token }`)
        }

        // set the Google Analytics client ID header if it exists
        if ( clientId ) {
            headers.set("X-Google-Analytics-Client-ID", clientId )
        }

        // set the request ID header for tracing and debugging purposes
        headers.set("X-Request-ID", requestId )

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
            // extract the new access token from the refresh result 
            let accessToken = refreshResult.data.data.access_token

            // store the new access token in the auth slice of 
            // the Redux store for future requests
            api.dispatch(
                setToken( accessToken )
            )

            // retry original request with new access token
            result = await baseQuery( args, api, extraOptions )
        } else {
            // if refresh failed, clear the access token from the auth slice of
            // the Redux store and localStorage to prevent further unauthorized requests
            api.dispatch(clearToken());
        }
    }

    // retrieve the request ID from the result meta's 
    // response header and add it to the result's error
    if ( result.meta?.response?.headers ) {
        // retrieve the request ID from the response headers
        const requestId = result.meta.response.headers.get("X-Request-ID")
        
        // if a request ID exists, add it to the result's error and data 
        // objects for tracing and debugging purposes
        if (requestId) {
            if (result.error) {
                result.error.requestId = requestId;
            }

            if (result.data) {
                result.data.requestId = requestId;
            }
        }
    }

    return result
}

const baseQueryWithAdminAuth = fetchBaseQuery({
    baseUrl: backendURL,
    prepareHeaders: async function( headers, _ ) {
        // get admin access key from env variables
        let adminKey = import.meta.env.VITE_INSTABOOKS_ADMIN_KEY

        // get client ID from Google Analytics ( or use mock value in development )
        // const clientId = await getClientId() 
        const clientId = "mock-client-id-for-admin-operations"

        // generate request id to be used for logging and 
        // debugging purposes
        const requestId = crypto.randomUUID()

        // set the Google Analytics client ID header if it exists
        if ( clientId ) {
            headers.set("X-Google-Analytics-Client-ID", clientId )
        }

        // set the request ID header for tracing and debugging purposes
        headers.set("X-Request-ID", requestId )

        // use admin key for admin-related operations/endpoints
        headers.set( "Authorization", `Bearer ${adminKey}` )

        return headers
    }
})

export async function baseQueryAdminAuthWithRequestId( args, api, extraOptions ) {
    // make initial request with admin auth
    let result = await baseQueryWithAdminAuth( args, api, extraOptions )

    // retrieve the request ID from the result meta's 
    // response header and add it to the result's error
    if ( result.meta?.response?.headers ) {
        const requestId = result.meta.response.headers.get("X-Request-ID")

        if ( requestId ) {
            if (result.error) {
                result.error.requestId = requestId;
            }

            if (result.data) {
                result.data.requestId = requestId;
            }
        }
    }

    return result
}