export function trackEvent( event, params = {} ) {
    if (!event) return;

    window.gtag?.("event", event, params);
}


export async function getClientId() {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

    return new Promise((resolve) => {
        if (!window.gtag) {
            resolve(null);
            return;
        }

        window.gtag?.(
            "get", 
            GA_MEASUREMENT_ID, 
            "client_id", 
            (clientId) => { resolve(clientId);}
        );
    });
}