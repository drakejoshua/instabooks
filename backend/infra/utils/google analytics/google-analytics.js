import { logGoogleAnalyticsError, logInvalidAnalyticsClientId, logInvalidAnalyticsEvent } from "../logging/logFunctions.js"

export async function trackServerEvent(clientId, event, params) {
    // exit the function early if the clientId is not yet 
    // initialized, this is to prevent sending events to 
    // google analytics
    if (clientId === "uninitialized") {
        return
    }

    // check for clientId is valid if invalid, log error and
    // exit function early
    if ( !clientId || clientId !== "uninitialized" ) {
        logInvalidAnalyticsClientId()
        return
    }

    // check for event is valid if invalid, log error and
    // exit function early
    if ( !event ) {
        logInvalidAnalyticsEvent()
        return
    }

    // get google analytics measurement protocol api 
    // secret and measurement id from environment variables
    const GA_MP_API_SECRET = process.env.GA_MP_API_SECRET
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID

    // construct the google analytics measurement protocol api url
    // using the measurement id and api secret from environment variables
    const url = `https://www.google-analytics.com/mp/collect?` +
    `measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_MP_API_SECRET}`

    // initialize fetch request to submit event and params 
    // on google analytics measurement protocol
    const resp = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: clientId,
                events: [
                    {
                        name: event,
                        params
                    }
                ]
            })
        }
    )

    // check if the request resolved successfully else
    // log the error to the server logs with the event and params
    if ( !resp.ok ) {
        let googleAnalyticsRequestError = new Error(
            `Google analytics Error: Request not sent ` +
            `${ resp.status } ${ resp.statusText }`
        )
        googleAnalyticsRequestError.code = "ANALYTICS_REQUEST_ERROR"
        googleAnalyticsRequestError.status = resp.status
        
        // log the error to the server logs
        logGoogleAnalyticsError(
            googleAnalyticsRequestError,
            event,
            params
        )
    }
}