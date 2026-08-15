import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        isAuthenticated: false
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload,
            state.isAuthenticated = true
        },
        setIsAuthenticated: (state) => {
            state.isAuthenticated = true
        },
        clearToken: (state) => {
            state.token = null,
            state.isAuthenticated = false
        },
        // logOut is different from clearToken because it also 
        // removes the token from localStorage and resets the 
        // authApi state via a listener middleware
        logOut: (state) => {
            state.token = null,
            state.isAuthenticated = false
        }
    }
})


export const {
    setToken,
    setIsAuthenticated,
    clearToken,
    logOut
} = authSlice.actions
export default authSlice.reducer