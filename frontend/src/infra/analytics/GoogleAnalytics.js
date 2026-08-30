export function trackEvent( event, params = {} ) {
    if (!event) return;

    window.gtag?.("event", event, params);
}

// getClientId()
export async function getClientId() {
    // retrieve the _ga cookie from the cookie list
    // in the browser
    const gaCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("_ga="));

    // if the _ga cookie is not found, return 
    // "uninitialized"
    if (!gaCookie) {
        return "uninitialized";
    }

    // parse the _ga cookie value to extract the client ID
    // [!]: the client ID is the last two parts of the cookie value
    // separated by a dot, e.g. GA1.2.1234567890.1234567890
    const cookieValue = gaCookie.split("=")[1];
    const parts = cookieValue.split(".");

    // check if the cookie value has at least 4 parts, 
    // if not return "uninitialized" ( if no 4 parts, 
    // then the cookie is invalid )
    if (parts.length < 4) {
        return "uninitialized";
    }

    // return the client ID ( last two parts of the 
    // cookie value )
    return `${parts[2]}.${parts[3]}`;
}