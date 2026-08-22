import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAdminAuth } from "../../../app/store/baseQuery";

// Demo-only admin authorization.
// This is intentionally not a production authentication mechanism.
// A production implementation should authenticate the user and
// authorize admin access server-side

export const adminApi = createApi({
    reducerPath: "admin",
    baseQuery: baseQueryWithAdminAuth,
    tagTypes: ["AdminOrders", "AdminBooks"],
    endpoints: function( builder ) {
        return {
            getBooks: builder.query({
                query: function( page ) {
                    return {
                        url: "/books/admin",
                        params: {
                            page
                        }
                    }
                },
                providesTags: function( result ) {
                    return [
                        { type: "AdminBooks", id: "LIST" },
                        ...(result?.data?.books ?? []).map(function(book) {
                            return {
                                type: "AdminBooks",
                                id: book.id
                            }
                        })
                    ]
                }
            }),
            searchBooks: builder.query({
                query: function( query ) {
                    return {
                        url: "/books/admin/search",
                        params: {
                            query
                        }
                    }
                }
            }),
            getBookById: builder.query({
                query: function( id ) {
                    return {
                        url: `/books/admin/${id}`
                    }
                },
                providesTags: function( result, error, id ) {
                    return [
                        { type: "AdminBooks", id }
                    ]
                }
            }),
            createBook: builder.mutation({
                query: function( newBook ) {
                    return {
                        url: "/books",
                        method: "POST",
                        body: createFormDataFromObject( newBook )
                    }
                },
                invalidatesTags: [
                    { type: "AdminBooks", id: "LIST" }
                ]
            }),
            updateBook: builder.mutation({
                query: function({ id, updatedBookDetails }) {
                    return {
                        url: `/books/${ id }`,
                        method: "PUT",
                        body: createFormDataFromObject( updatedBookDetails )
                    }
                },
                invalidatesTags: function( result, error, { id } ) {
                    return [{ type: "AdminBooks", id }]
                }
            }),
            deleteBook: builder.mutation({
                query: function( id ) {
                    return {
                        url: `/books/${id}`,
                        method: "DELETE"
                    }
                },
                invalidatesTags: function( result, error, { id } ) {
                    return [{ type: "AdminBooks", id }]
                }
            }),
            getOrders: builder.query({
                query: function( page ) {
                    return {
                        url: "/orders/admin",
                        params: {
                            page
                        }
                    }
                },
                providesTags: function( result ) {
                    return [
                        { type: "AdminOrders", id: "LIST" },
                        ...(result?.data?.orders ?? []).map(function(order) {
                            return {
                                type: "AdminOrders",
                                id: order.id
                            }
                        })
                    ]
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
    useSearchBooksQuery,
    useGetBookByIdQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useGetOrdersQuery
} = adminApi