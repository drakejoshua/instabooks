import { useEffect } from "react";
import { logger } from "../../infra/logging/logger";

// useRouteLogger hook 
// This hook logs errors that occur on a specific route,
// along with a custom message and user data. It uses the 
// useEffect hook to monitor changes in the error and data
// parameters. When an error is detected, it logs the error 
// using the app's dedicated logger, including the provided 
// message, error details, request ID, and user ID.

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