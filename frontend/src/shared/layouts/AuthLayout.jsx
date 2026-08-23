import { Outlet } from "react-router-dom";
import { useProtectedRoute } from "../hooks/useProtectedRoute";

export function Component() {
    const { isLoading, error } = useProtectedRoute()

    if (isLoading) {
        return <div> loading authenticated user information </div>;
    }

    if ( error ) {
        return <></>
    }

    return <Outlet />;
}
