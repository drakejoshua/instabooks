import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAdminAuth } from "../../../app/store/baseQuery";

export const adminApi = createApi({
    reducerPath: "admin",
    baseQuery: baseQueryWithAdminAuth,
    endpoints: function( builder ) {
        return {
            getAdminBooks: builder.query({
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
            getAdminBookById: builder.query({
                query: function( id ) {
                    return {
                        url: `/books/admin/${id}`
                    }
                }
            }),
            createAdminNewBook: builder.mutation({
                query: function( newBook ) {
                    let newBookFormData = new FormData()

                    for ( let key in newBook ) {
                        newBookFormData.set( key, newBook.key )
                    }

                    return {
                        url: "/books",
                        method: "POST",
                        body: newBookFormData
                    }
                }
            }),
            updateAdminBookById: builder.mutation({
                query: function({ id, updatedBookDetails }) {
                    let updatedBookDetailsFormData = new FormData()

                    for ( let key in updatedBookDetails ) {
                        updatedBookDetailsFormData.set( 
                            key, 
                            updatedBookDetails.key 
                        )
                    }

                    return {
                        url: `/books/${ id }`,
                        method: "POST",
                        body: updatedBookDetailsFormData
                    }
                }
            }),
            deleteAdminBookById: builder.mutation({
                query: function( id ) {
                    return {
                        url: `/books/${id}`,
                        method: "DELETE"
                    }
                }
            }),
            getAllAdminOrders: builder.query({
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


export const {
    useGetAdminBooksQuery,
    useGetAdminBookByIdQuery,
    useCreateAdminNewBookMutation,
    useUpdateAdminBookByIdMutation,
    useDeleteAdminBookByIdMutation,
    useGetAllAdminOrdersQuery
} = adminApi