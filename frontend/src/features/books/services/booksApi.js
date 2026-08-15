import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefreshAuth } from "../../../app/store/baseQuery";

export const booksApi = createApi({
    reducerPath: "booksApi",
    baseQuery: baseQueryWithRefreshAuth,
    endpoints: function( builder ) {
        return {
            getBookDetails: builder.query({
                query: function( id ) {
                    return `/books/${id}`
                }
            }),
            getBooks: builder.query({
                query: function( page ) {
                    return {
                        url: "/books",
                        params: {
                            page
                        }
                    }
                }
            }),
            searchBooks: builder.query({
                query: function( query ) {
                    return {
                        url: "/books/search",
                        params: {
                            query
                        }
                    }
                }
            })
        }
    }
})


export const {
    useGetBookDetailsQuery,
    useGetBooksQuery,
    useSearchBooksQuery
} = booksApi