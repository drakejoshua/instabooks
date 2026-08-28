import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAdminAuthWithRequestId } from "../../../app/store/baseQuery";

// Demo-only admin authorization.
// This is intentionally not a production authentication mechanism.
// A production implementation should authenticate the user and
// authorize admin access server-side

export const adminApi = createApi({
    reducerPath: "admin",
    baseQuery: baseQueryAdminAuthWithRequestId,
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
                providesTags: (result, error, id) => [
                    { type: "AdminBooks", id }
                ]
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
                invalidatesTags: (result, error, { id }) => [
                    { type: "AdminBooks", id },
                    { type: "AdminBooks", id: "LIST" }
                ]
            }),
            deleteBook: builder.mutation({
                query: function( id ) {
                    return {
                        url: `/books/${id}`,
                        method: "DELETE"
                    }
                },
                invalidatesTags: (result, error, { id }) => [
                    { type: "AdminBooks", id },
                    { type: "AdminBooks", id: "LIST" }
                ]
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