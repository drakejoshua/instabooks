export function trackEvent( event, params = {} ) {
    if (!event) return;

    window.gtag?.("event", event, params);
}