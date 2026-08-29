import { authApi } from "../../features/users/services/authApi"
import { baseApi } from "../../app/services/baseApi"

// userApi
// This is a service that provides endpoints for managing 
// user-related data in the application. It uses the baseApi
// service to define the endpoints and their corresponding
// queries and mutations. The service includes endpoints for 
// adding, updating, and deleting books in the user's cart, 
// as well as adding and deleting user addresses. It also 
// handles updating the Redux store with the latest user data 
// and invalidating cache tags when necessary.

export const userApi =  baseApi.injectEndpoints({
    endpoints: function( builder ) {
        return {
            // addBookToCart endpoint - adds a book to the user's cart
            // by sending the book ID and quantity to the backend API.
            // It also updates the Redux store with the latest cart data
            // after a successful addition.
            addBookToCart: builder.mutation({
                query: function({ book_id, quantity }) {
                    return {
                        url: "/user/cart",
                        method: "POST",
                        body: {
                            book_id,
                            quantity
                        }
                    }
                },
                onQueryStarted: onCartQueryStarted
            }),
            // updateBookInCart endpoint - updates the quantity of a
            // specific book in the user's cart by sending the book ID
            // and new quantity to the backend API. It also updates the
            // Redux store with the latest cart data after a successful
            // update.
            updateBookInCart: builder.mutation({
                query: function({ book_id, quantity }) {
                    return {
                        url: `/user/cart/${book_id}`,
                        method: "PUT",
                        body: {
                            quantity
                        }
                    }
                },
                onQueryStarted: onCartQueryStarted
            }),
            // deleteBookFromCart endpoint - removes a specific book from the
            // user's cart by sending the book ID to the backend API. It also
            // updates the Redux store with the latest cart data after a
            // successful deletion.
            deleteBookFromCart: builder.mutation({
                query: function( book_id ) {
                    return {
                        url: `/user/cart/${book_id}`,
                        method: "DELETE",
                    }
                },
                onQueryStarted: onCartQueryStarted
            }),
            // addAddress endpoint - adds a new address to the user's
            // address list by sending the address data to the backend API.
            // It also updates the Redux store with the latest address data
            // after a successful addition.
            addAddress: builder.mutation({
                query: function( address ) {
                    return {
                        url: "/user/address",
                        method: "POST",
                        body: {
                            address
                        }
                    }
                },
                onQueryStarted: onAddressQueryStarted
            }),
            // deleteAddress endpoint - removes a specific address from the
            // user's address list by sending the address data to the backend API.
            // It also updates the Redux store with the latest address data
            // after a successful deletion.
            deleteAddress: builder.mutation({
                query: function( address ) {
                    return {
                        url: "/user/address",
                        method: "DELETE",
                        body: {
                            address
                        }
                    }
                },
                onQueryStarted: onAddressQueryStarted
            })
        }
    }
})


async function onCartQueryStarted(
    _,
    api
) {
    try {
        let { data: updatedCartData } = await api.queryFulfilled
    
        api.dispatch( 
            authApi.util.updateQueryData(
                "getMe",
                undefined,
                function( draft ) {
                    draft.data.cart = updatedCartData.data
                }
            )
        )
    } catch( error ) {
        console.error("Error updating user cart in cache:", error)
    }
}

async function onAddressQueryStarted(
    _,
    api
) {
    try {
        let { data: updatedAddressData } = await api.queryFulfilled

        api.dispatch(
            authApi.util.updateQueryData(
                "getMe",
                undefined,
                function( draft ) {
                    draft.data.addresses = updatedAddressData.data
                }
            )
        )
    } catch( error ) {
        console.error("Error updating user addresses in cache:", error)
    }
}


export const {
    useAddBookToCartMutation,
    useDeleteBookFromCartMutation,
    useUpdateBookInCartMutation,
    useAddAddressMutation,
    useDeleteAddressMutation
} = userApi