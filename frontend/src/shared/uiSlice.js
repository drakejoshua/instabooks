import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        dialogs: [],
        toasts: []
    },
    reducers: {
        addToast: (state, action) => {
            state.toasts.push(action.payload)
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
        },
        addDialog: (state, action) => {
            state.dialogs.push(action.payload)
        },
        removeDialog: (state, action) => {
            state.dialogs = state.dialogs.filter(dialog => dialog.id !== action.payload)
        }
    }
})


// export slice actions for dispatch 
export const { 
    addToast, 
    removeToast,
    addDialog,
    removeDialog
} = uiSlice.actions

// export slice reducer for state selection
export default uiSlice.reducer