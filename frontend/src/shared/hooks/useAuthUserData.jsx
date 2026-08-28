import { useSelector } from "react-redux";
import { authApi } from "../../features/users/services/authApi";

export function useAuthUserData() {
    return useSelector(
        authApi.endpoints.getMe.select()
    )
}