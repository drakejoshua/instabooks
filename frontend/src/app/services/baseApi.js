import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefreshAuth } from '../store/baseQuery';

// baseApi acts as a wrapper around the baseQueryWithRefreshAuth 
// function, to be used across the app for making authenticated
// requests to the backend API. It provides a consistent interface for
// making API calls, handling token refresh, and managing authentication
// state in a centralized manner.
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithRefreshAuth,
    endpoints: () => ({}),
    tagTypes: ["books","user","orders"]
});