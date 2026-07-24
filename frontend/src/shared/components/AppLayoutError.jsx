import { useNavigate, useRouteError } from 'react-router-dom';
import ErrorComponent from './ErrorComponent';

function AppLayoutError() {
    let error = useRouteError();
    let navigateTo = useNavigate();

    return (
        <ErrorComponent 
            error={error} 
            reset={() => navigateTo("/")}
        />
    )
}

export default AppLayoutError
