import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearToken, logOut, setToken } from "./authSlice";
import { authApi } from "./services/authApi";

const LocalStorageAuthKey = import.meta.env.VITE_LOCALSTORAGE_AUTH_KEY

export const AuthListenerMiddlware = createListenerMiddleware();

AuthListenerMiddlware.startListening({
    actionCreator: logOut,
    effect: function( action, api ) {
        // remove access token from localstorage
        localStorage.removeItem( LocalStorageAuthKey )

        // reset authApi state
        api.dispatch(
            authApi.util.resetApiState()
        )
    }
})

AuthListenerMiddlware.startListening({
    actionCreator: clearToken,
    effect: function() {
        // remove access token from localstorage
        localStorage.removeItem( LocalStorageAuthKey )
    }
})


AuthListenerMiddlware.startListening({
    actionCreator: setToken,
    effect: function( action ) {
        // save access token to localStorage
        localStorage.setItem( LocalStorageAuthKey, action.payload )
    }
})