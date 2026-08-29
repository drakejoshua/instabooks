import { useNavigate, useRouteError } from 'react-router-dom';
import ErrorComponent from '../ui/ErrorComponent';
import { logger } from '../../infra/logging/logger';

// AppLayoutError component
// This component is used to handle errors that occur 
// within the AppLayout. It retrieves the error using 
// the useRouteError hook and logs it using the logger. 
// It also provides a way for users to navigate back to 
// the home page by using the useNavigate hook.

function AppLayoutError() {
    let error = useRouteError();
    let navigateTo = useNavigate();

    // log the error using the app's dedicated logger
    logger.error("AppLayoutError caught an error", error, { routeError: error });

    return (
        <ErrorComponent 
            error={error} 
            reset={() => navigateTo("/")}
        />
    )
}

export default AppLayoutError
