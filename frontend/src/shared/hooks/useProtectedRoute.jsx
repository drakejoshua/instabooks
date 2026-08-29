import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../../features/users/services/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearToken, setIsAuthenticated } from "../../features/users/authSlice";

// useProtectedRoute hook
// This custom hook is designed to protect routes in the application by 
// checking the user's authentication status. It uses the useSelector
// hook to access the Redux store and determine if the user is authenticated.
// The hook also uses the useGetMeQuery to fetch the authenticated user's data. 
// If the user is not authenticated, it redirects them to the login page.

export function useProtectedRoute() {
    // get the authentication status from the Redux store
    const isAuthenticated = useSelector( state => state.auth.isAuthenticated )

    // fetch the authenticated user's data using the useGetMeQuery hook
    const { data, isLoading, error } = useGetMeQuery();

    // dispatch is used to dispatch actions to the Redux store
    const dispatch = useDispatch()

    // navigateTo is used to programmatically navigate to different routes
    const navigateTo = useNavigate()

    // useEffect hook to check the authentication status 
    // and redirect if necessary ( based on changes in 
    // "isAuthenticated" )
    useEffect( function() {
        if ( !isLoading && !isAuthenticated ) {
            navigateTo("/auth/google")
        }
    }, [ isAuthenticated ] )

    // useEffect hook to handle the authentication state based on the
    // result of the useGetMeQuery. If the user data is successfully 
    // fetched, it sets the user as authenticated. If there's an error, 
    // it clears the token and redirects to the login page.
    useEffect( function() {
        // if the user data is successfully fetched 
        // and the user is not, set the user as authenticated
        // to prevent redirecting to the login page
        if ( !isLoading && data ) {
            dispatch( setIsAuthenticated() )
        }

        // if there's an error fetching the user data,
        // redirect to the login page and clear the token
        if ( !isLoading && error ) {
            navigateTo("/auth/google")
            
            dispatch( clearToken() )
        }
    }, [ isLoading ])

    // return the user data, loading state, error state, 
    // and authentication status
    return { data, isLoading, error, isAuthenticated }
}