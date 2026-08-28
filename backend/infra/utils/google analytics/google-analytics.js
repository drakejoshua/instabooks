import { logGoogleAnalyticsError, logInvalidAnalyticsClientId, logInvalidAnalyticsEvent } from "../logging/logFunctions.js"

export async function trackServerEvent(clientId, event, params) {
    // check for clientId to use if absent, 
    // exit function early
    if ( !clientId ) {
        logInvalidAnalyticsClientId()
        return
    }

    if ( !event ) {
        logInvalidAnalyticsEvent()
        return
    }

    const GA_MP_API_SECRET = process.env.GA_MP_API_SECRET
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID

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
    // throw an error to prevent further execution
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