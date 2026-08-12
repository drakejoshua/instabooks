import { createSlice } from "@reduxjs/toolkit"

const LocalStorageAuthKey = import.meta.env.VITE_LOCALSTORAGE_AUTH_KEY

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        isAuthenticated: false
    },
    reducers: {
        setToken: (state, action) => {
            // set auth token to localStorage
            localStorage.setItem( LocalStorageAuthKey, action.payload )

            state.token = action.payload,
            state.isAuthenticated = true
        },
        setIsAuthenticated: (state) => {
            state.isAuthenticated = true
        },
        logOut: (state) => {
            // remove access token from localstorage
            localStorage.removeItem( LocalStorageAuthKey )

            state.token = null,
            state.isAuthenticated = false
        }
    }
})


export const {
    setToken,
    setIsAuthenticated,
    logOut
} = authSlice.actions
export default authSlice.reducer