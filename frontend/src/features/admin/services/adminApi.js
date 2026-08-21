import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAdminAuth } from "../../../app/store/baseQuery";

// Demo-only admin authorization.
// This is intentionally not a production authentication mechanism.
// A production implementation should authenticate the user and
// authorize admin access server-side

export const adminApi = createApi({
    reducerPath: "admin",
    baseQuery: baseQueryWithAdminAuth,
    endpoints: function( builder ) {
        return {
            getBooks: builder.query({
                query: function({ limit, page }) {
                    return {
                        url: "/books/admin",
                        params: {
                            limit,
                            page
                        }
                    }
                }
            }),
            getBookById: builder.query({
                query: function( id ) {
                    return {
                        url: `/books/admin/${id}`
                    }
                }
            }),
            createBook: builder.mutation({
                query: function( newBook ) {
                    return {
                        url: "/books",
                        method: "POST",
                        body: createFormDataFromObject( newBook )
                    }
                }
            }),
            updateBook: builder.mutation({
                query: function({ id, updatedBookDetails }) {
                    return {
                        url: `/books/${ id }`,
                        method: "POST",
                        body: createFormDataFromObject( updatedBookDetails )
                    }
                }
            }),
            deleteBook: builder.mutation({
                query: function( id ) {
                    return {
                        url: `/books/${id}`,
                        method: "DELETE"
                    }
                }
            }),
            getOrders: builder.query({
                query: function({ limit, page }) {
                    return {
                        url: "/orders/admin",
                        params: {
                            limit,
                            page
                        }
                    }
                }
            })
        }
    }
})


function createFormDataFromObject( obj ) {
    let formData = new FormData()

    for ( let key in obj ) {
        formData.set( key, obj[key] )
    }

    return formData
}


export const {
    useGetBooksQuery,
    useGetBookByIdQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useGetOrdersQuery
} = adminApi