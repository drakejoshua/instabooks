import { authApi } from "../../features/users/services/authApi"
import { baseApi } from "../../app/services/baseApi"

export const userApi =  baseApi.injectEndpoints({
    endpoints: function( builder ) {
        return {
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
            deleteBookFromCart: builder.mutation({
                query: function( book_id ) {
                    return {
                        url: `/user/cart/${book_id}`,
                        method: "DELETE",
                    }
                },
                onQueryStarted: onCartQueryStarted
            }),
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