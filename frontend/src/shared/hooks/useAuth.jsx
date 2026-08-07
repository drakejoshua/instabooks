import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../../features/users/services/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logOut } from "../../features/users/authSlice";

export function useAuth() {
    const { isAuthenticated } = useSelector( state => state.auth.isAuthenticated )
    const { data, isLoading, error } = useGetMeQuery();
    const dispatch = useDispatch()

    console.log("auth error: ", error)
    console.log("auth loading: ", isLoading)
    console.log("auth data: ", data)

    const navigateTo = useNavigate()

    useEffect( function() {
        if ( !isLoading && !isAuthenticated ) {
            navigateTo("/auth/google")
        }
    }, [ isAuthenticated ] )

    useEffect( function() {
        if ( !isLoading && error ) {
            dispatch( logOut() )

            navigateTo("/auth/google")
        }
    }, [ isLoading ])

    return { data, isLoading, error, isAuthenticated }
}