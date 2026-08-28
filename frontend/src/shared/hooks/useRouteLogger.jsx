import { useEffect } from "react";
import { logger } from "../../infra/logging/logger";

export function useRouteLogger( 
    message = "Error on route",
    error, 
    data
) {
    useEffect( function() {
        if (!error) return;

        // log the error using the app's dedicated logger
        logger.error(
            message,
            error,
            {
                requestId: error?.requestId,
                userId: data?.data?.id
            }
        );
    }, [ error, data ])
}