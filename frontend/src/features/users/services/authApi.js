import { baseApi } from "../../../app/services/baseApi.js"

export const authApi = baseApi.injectEndpoints({
    endpoints: function( builder ) {
        return {
            googleVerify: builder.query({
                query: ( id ) => ({
                    url: "/auth/google/verify",
                    params: {
                        authId: id
                    }
                })
            }),
            getMe: builder.query({
                query: () => "/auth/me",
                providesTags: ["user"]
            }),
            logout: builder.mutation({
                query: () => ({
                    url: "/auth/logout",
                    method: "GET"
                })
            }),
            updateUser: builder.mutation({
                query: function({ name, photo, delete_photo = false }) {
                    let newUserInfo = new FormData()

                    if ( name ) newUserInfo.append("name", name)
                    if ( photo ) newUserInfo.append("photo", photo)

                    return {
                        url: `/auth/update?deletePhoto=${ delete_photo }`,
                        method: "POST",
                        body: newUserInfo
                    }
                },
                invalidatesTags: ["user"]
            })
        }
    }
})


export const {
    useGoogleVerifyQuery,
    useGetMeQuery,
    useLogoutMutation,
    useUpdateUserMutation
} = authApi