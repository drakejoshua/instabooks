import { useNavigate, useRouteError } from 'react-router-dom';
import ErrorComponent from '../ui/ErrorComponent';
import { logger } from '../../infra/logging/logger';

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
