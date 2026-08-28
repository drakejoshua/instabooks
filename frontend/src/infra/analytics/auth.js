import { trackEvent } from "./GoogleAnalytics"

// login event tracking - login because of google auth 
// button click which ends up in a successful login
export function trackGoogleLoginEvent() {
    trackEvent("login", {
        method: "Google"
    })
}

export const GOOGLE_AUTH_STATUS = {
    SUCCESS: "success",
    FAILURE: "failure"
}