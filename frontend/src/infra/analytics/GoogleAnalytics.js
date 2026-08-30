export function trackEvent( event, params = {} ) {
    if (!event) return;

    window.gtag?.("event", event, params);
}

// getClientId()
export async function getClientId() {
    return "uninitialized"
}