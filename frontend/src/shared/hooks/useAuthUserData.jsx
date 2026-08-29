import { useSelector } from "react-redux";
import { authApi } from "../../features/users/services/authApi";

// useAuthUserData hook
// This custom hook retrieves the authenticated user's data from the Redux store. 
// It uses the useSelector hook to access the state managed by the authApi slice, 
// specifically selecting the data returned by the getMe endpoint. 
// The hook returns the user's data, which can be used in various components 
// to display user-specific information or perform user-related actions.

export function useAuthUserData() {
    return useSelector(
        authApi.endpoints.getMe.select()
    )
}