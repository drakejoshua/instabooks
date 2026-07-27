import { trackEvent } from "./GoogleAnalytics"

// intialize auth
export function trackGoogleAuthInitEvent() {
    trackEvent("google_auth_init", {
        method: "Google"
    })
}


// auth verification
export function trackGoogleAuthVerifyEvent( status ) {
    trackEvent("google_auth_verify", {
        method: "Google",
        status: status || GOOGLE_AUTH_STATUS.FAILURE
    })
}

export const GOOGLE_AUTH_STATUS = {
    SUCCESS: "success",
    FAILURE: "failure"
}