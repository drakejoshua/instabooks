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
        // const clientId = await getClientId() 
        const clientId = "mock-client-id-for-frontend-operations"

        // generate request id to be used for logging and 
        // debugging purposes
        const requestId = crypto.randomUUID()

        if ( token ) {
            headers.set("Authorization", `Bearer ${ token }`)
        }

        if ( clientId ) {
            headers.set("X-Google-Analytics-Client-ID", clientId )
        }

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

    // retrieve the request ID from the result meta's 
    // response header and add it to the result's error
    if ( result.meta?.response?.headers ) {
        const requestId = result.meta.response.headers.get("X-Request-ID")
        
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

        if ( clientId ) {
            headers.set("X-Google-Analytics-Client-ID", clientId )
        }

        headers.set("X-Request-ID", requestId )

        // use admin key for admin-related operations/endpoints
        headers.set( "Authorization", `Bearer ${adminKey}` )

        return headers
    }
})

export async function baseQueryAdminAuthWithRequestId( args, api, extraOptions ) {
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