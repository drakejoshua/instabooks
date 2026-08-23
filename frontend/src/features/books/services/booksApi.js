import { baseApi } from "../../../app/services/baseApi";

export const booksApi = baseApi.injectEndpoints({
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