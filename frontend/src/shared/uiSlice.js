import { createSlice } from '@reduxjs/toolkit'

// uiSlice 
// This is a Redux slice that manages the state of 
// the user interface (UI) in the application. It's responsible 
// for handling the state of dialogs and toasts in the application.

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        dialogs: [],
        toasts: []
    },
    reducers: {
        // addToast function - adds a new toast to the state
        // by pushing the payload (toast object) to the toasts array.
        // The toast object should contain an id, message, and type.
        addToast: (state, action) => {
            state.toasts.push(action.payload)
        },
        // removeToast function - removes a toast from the state
        // by filtering the toasts array and keeping only those
        // toasts whose id does not match the payload (toast id).
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
        },
        // addDialog function - adds a new dialog to the state
        // by pushing the payload (dialog object) to the dialogs array.
        // The dialog object should contain an id, title, description, and content.
        addDialog: (state, action) => {
            state.dialogs.push(action.payload)
        },
        // removeDialog function - removes a dialog from the state
        // by filtering the dialogs array and keeping only those
        // dialogs whose id does not match the payload (dialog id).
        removeDialog: (state, action) => {
            state.dialogs = state.dialogs.filter(dialog => dialog.id !== action.payload)
        }
    }
})


// export slice actions for dispatch across the
// application
export const { 
    addToast, 
    removeToast,
    addDialog,
    removeDialog
} = uiSlice.actions

// export slice reducer for state selection
export default uiSlice.reducer