import { Outlet } from "react-router-dom";
import { useProtectedRoute } from "../hooks/useProtectedRoute";

// AuthLayout component
// This component is responsible for handling the 
// authentication state of the user. It uses the 
// useProtectedRoute hook to check if the user is 
// authenticated. If the user is authenticated, it 
// renders the child components using the Outlet component.

export function Component() {
    // get the authentication state using the useProtectedRoute hook
    const { isLoading, error } = useProtectedRoute()

    // if the authentication state is loading, display a loading message
    if (isLoading) {
        return <div> loading authenticated user information </div>;
    }

    // if there is an error in the authentication state,
    // return an empty fragment to prevent rendering the child components
    // ( unauthenticated flash of content ) while the user is being 
    // redirected to the login page
    if ( error ) {
        return <></>
    }

    // if the user is authenticated, render the child components
    return <Outlet />;
}
