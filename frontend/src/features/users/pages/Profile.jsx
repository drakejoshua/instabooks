import { DropdownMenu, Form } from "radix-ui";
import TextField from "../../../shared/components/TextField";
import EmailField from "../../../shared/components/EmailField";
import Button from "../../../shared/components/Button";
import UserAvatar from "../../../shared/components/UserAvatar";
import { FaArrowRotateLeft, FaArrowsToCircle, FaCircleArrowLeft, FaFileArrowUp, FaTrash } from "react-icons/fa6";
import { AddressListItem } from "../components/AddressListItem";
import { OrderPreview } from "../components/OrderPreview";
import Heading from "../../../shared/components/Heading";
import { useGetMeQuery, useUpdateUserMutation } from "../services/authApi";
import { useGetOrdersQuery } from "../../../shared/services/ordersApi";
import { useEffect, useState } from "react";
import { ToastTypes, useToastActions } from "../../../shared/ui/ToastRenderer";
import { DialogComponent, useDialogActions } from "../../../shared/ui/DialogRenderer";
import { useAddAddressMutation, useDeleteAddressMutation } from "../../../shared/services/userApi";

export function Component() {
    const defaultLimit = 20
    const [ page, setPage ] = useState( 1 )
    
    const [ name, setName ] = useState("")
    let [ isPhotoUpdateDialogOpen, setIsPhotoUpdateDialogOpen ] = useState( false )
    let [ profilePhoto, setProfilePhoto ] = useState( null )
    let [ newAddress, setNewAddress ] = useState( "" )
    let [ isAddressAdditionDialogOpen, setIsAddressAdditionDialogOpen ] = useState( false )

    const { data: user } = useGetMeQuery()
    const { 
        data: ordersData, 
        isLoading: isOrdersLoading,
        isFetching: isOrdersFetching
    } = useGetOrdersQuery({ limit: defaultLimit, page })

    const [ 
        updateUser, 
        { 
            isLoading: isUpdateUserLoading,
            error: updateUserError
        } 
    ] = useUpdateUserMutation()

    const [ deleteAddress, { isLoading: isDeleteAddressLoading } ] = useDeleteAddressMutation()
    
    const [ addAddress, { isLoading: isAddAddressLoading } ] = useAddAddressMutation()

    const { openToast } = useToastActions()
    
    const { openDialog, closeDialog } = useDialogActions()

    useEffect( function() {
        if ( user?.data?.name ) {
            setName( user?.data?.name )
        }
    }, [ user ])

    function handleLoadMoreOrders() {
        // perform bounds check to ensure that the 
        // next page of orders is within the total 
        // number of orders
        if ( ordersData?.data?.orders.length < ordersData?.data?.totalOrders ) {
            setPage( page + 1 )
        }
    }

    async function handleProfilePhotoDeletion() {
        try {
            await updateUser({
                delete_photo: true
            }).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Profile photo deleted successfully"
            })
        } catch( error ) {
            let dialogId = openDialog({
                title: "Profile Photo Deletion Error",
                description: `An error occured while trying to delete
                your profile photo. Error: ${ error?.message }`,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )

                                handleProfilePhotoDeletion()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    async function confirmProfilePhotoDeletion() {
        let dialogId = openDialog({
            title: "Confirm Deletion",
            description: `Are you sure you want to delete 
            your profile photo?`,
            render: function() {
                return (
                    <Button
                        className="
                            mt-4
                            w-full
                            block
                        "
                        onClick={function() {
                            closeDialog( dialogId )
                            handleProfilePhotoDeletion()
                        }}
                    >
                        Delete Photo
                    </Button>
                )
            }
        })
    }

    async function handleProfileInfoUpdate(event) {
        // prevent default form submission behavior
        event?.preventDefault()

        if ( !name ) {
            return openToast({
                type: ToastTypes.error,
                message: "Name can't be empty or needs to be changed before updating profile info"
            })
        }

        try {
            await updateUser({
                name
            }).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Profile info updated successfully"
            })
        } catch( error ) {
            let dialogId = openDialog({
                title: "Profile Info Update Error",
                description: `An error occured while trying to update
                your profile info. Error: ${ 
                    error?.message ||
                    updateUserError.data?.error?.message
                }`,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleProfileInfoUpdate()
                            }}
                            className="w-full"
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    async function handleDeleteAddress( address ) {
        try {
            await deleteAddress( address ).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Address deleted successfully"
            })
        } catch( error ) {
            let dialogId = openDialog({
                title: "Address Deletion Error",
                description: `An error occured while trying to delete
                this address. Error: ${ error?.message }`,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleDeleteAddress( address )
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        }
    }

    async function confirmAddressDeletion( address ) {
        let dialogId = openDialog({
            title: "Confirm Deletion",
            description: `Are you sure you want to delete 
            this address?`,
            render: function() {
                return (
                    <Button
                        className="
                            mt-4
                            w-full
                            block
                        "
                        onClick={function() {
                            closeDialog( dialogId )
                            handleDeleteAddress( address )
                        }}
                    >
                        Delete Address
                    </Button>
                )
            }
        })
    }

    async function handleAddAddress( event ) {
        // prevent default form submission behaviour
        event?.preventDefault()

        if ( !newAddress ) {
            return openToast({
                type: ToastTypes.error,
                message: "Address can't be empty"
            })
        }

        try {
            await addAddress( newAddress ).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Address added successfully"
            })
        } catch( error ) {
            let dialogId = openDialog({
                title: "Address Addition Error",
                description: `An error occured while trying to add
                this address. Error: ${ error?.message }`,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleAddAddress()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        } finally {
            setIsAddressAdditionDialogOpen( false )
            setNewAddress( "" )
        }
    }

    async function handleProfilePhotoUpdate() {
        if ( !profilePhoto ) {
            return openToast({
                type: ToastTypes.error,
                message: "Please select a profile photo to upload"
            })
        }

        try {
            await updateUser({
                photo: profilePhoto
            }).unwrap()

            openToast({
                type: ToastTypes.success,
                message: "Profile photo updated successfully"
            })
        } catch( error ) {
            let dialogId = openDialog({
                title: "Profile Photo Update Error",
                description: `An error occured while trying to update
                your profile photo. Error: ${ error?.message }`,
                render: function() {
                    return (
                        <Button
                            onClick={ function() {
                                closeDialog( dialogId )
                                handleProfilePhotoUpdate()
                            }}
                        >
                            Retry
                        </Button>
                    )
                }
            })
        } finally {
            setIsPhotoUpdateDialogOpen( false )
            setProfilePhoto( null )
        }
    }
    
    return (
        <>
            <div
                className="
                block lg:grid
                lg:grid-cols-[1fr_4fr]
                gap-12
                pb-8
            "
            >
                <aside
                    className="
                    hidden lg:flex
                    flex-col
                    text-lg
                    capitalize
                    sticky
                    top-8
                    self-start

                    *:cursor-pointer
                    *:px-4 *:py-3
                    *:capitalize
                    *:text-left
                "
                >
                    <button
                        className="
                        bg-instabooks-blue
                        text-white
                        rounded-lg
                    "
                    >
                        profile
                    </button>

                    <button>orders</button>
                </aside>

                <section
                    className="
                    max-w-lg
                "
                >
                    <div>
                        <Heading as="h2">your profile</Heading>

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <UserAvatar
                                    className="
                                    h-40
                                    w-40
                                    mt-8
                                "
                                    src={user?.data?.photo_url}
                                    alt={`profile photo of ${user?.data?.name}`}
                                    iconClassName="text-[36px]"
                                />
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    side="right"
                                    sideOffset={8}
                                    align="center"
                                    className="
                                    bg-instabooks-black
                                    text-white
                                    rounded-lg
                                    px-4 py-5

                                    *:flex
                                    *:items-center
                                    *:gap-2
                                    *:capitalize
                                    *:px-4 *:py-2
                                    *:hover:bg-white
                                    *:hover:text-instabooks-black
                                    *:focus:bg-white
                                    *:focus:text-instabooks-black
                                    *:outline-none
                                    *:rounded-md
                                    *:cursor-pointer
                                "
                                >
                                    <DropdownMenu.Item
                                        onSelect={ () => setIsPhotoUpdateDialogOpen( true ) }
                                    >
                                        <FaFileArrowUp />
                                        upload new photo
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                        onSelect={ confirmProfilePhotoDeletion }
                                    >
                                        <FaTrash />
                                        remove photo
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>

                        {/* profile info */}
                        <Form.Root
                            className="
                                mt-8
                                flex
                                flex-col
                                gap-2.5
                                items-start 
                            "
                            onSubmit={ handleProfileInfoUpdate }
                        >
                            {/* name */}
                            <TextField
                                name="name"
                                label="Name"
                                className="w-full"
                                valueMissingMessage="your name can't be omitted"
                                required
                                value={ name }
                                onChange={ (e) => setName( e.target.value ) }
                            />

                            {/* 
                                email - users can't update email since they're 
                                signing up with google 
                            */}
                            <EmailField
                                name="email"
                                label="email"
                                className="w-full"
                                valueMissingMessage={"your email can't be omitted"}
                                typeMismatchMessage={"your email is invalid"}
                                disabled
                                value={user?.data?.email ?? ""}
                                inputClassName="
                                    disabled:cursor-not-allowed 
                                    disabled:opacity-70
                                "
                            />

                            {/* email warning text */}
                            <p
                                className="
                                    text-gray-600
                                    text-sm
                                "
                            >
                                Email can't be updated since you signed up with Google.
                            </p>

                            <Form.Submit asChild>
                                <Button 
                                    className={`
                                        capitalize 
                                        mt-4
                                        disabled:cursor-not-allowed
                                        disabled:opacity-70
                                    `}
                                    disabled={ isUpdateUserLoading }
                                >
                                    { isUpdateUserLoading ? "updating profile..." : "update profile" }
                                </Button>
                            </Form.Submit>
                        </Form.Root>

                        {/* addresses */}
                        <div
                            className="
                            mt-8
                        "
                        >
                            <span
                                className="
                                capitalize
                            "
                            >
                                saved addresses
                            </span>

                            {/* address list */}
                            <div
                                className="
                                mt-4
                                flex
                                flex-col
                                gap-3
                            "
                            >
                                {/* address items */}
                                {
                                    user?.data?.addresses.length != 0 && user?.data?.addresses?.map( function( address, index ) {
                                        return <AddressListItem 
                                            key={index} 
                                            address={address} 
                                            handleDeleteAddress={ () => confirmAddressDeletion( address ) }
                                            deleteLoading={ isDeleteAddressLoading }
                                        />
                                    })
                                }

                                {/* no addresses message */}
                                {
                                    user?.data?.addresses.length === 0 && (
                                        <p className="text-gray-600">
                                            You haven't saved any addresses yet.
                                        </p>
                                    )
                                }
                            </div>

                            <Button 
                                className="
                                    capitalize 
                                    mt-6
                                    disabled:cursor-not-allowed
                                    disabled:opacity-70
                                "
                                disabled={ isAddAddressLoading }
                                onClick={ () => setIsAddressAdditionDialogOpen( true ) }
                            >
                                add new address
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Heading className="mt-12">your orders</Heading>

                        {
                            ordersData?.data?.orders.length === 0 && <p
                                className="
                                    text-gray-600
                                    mt-6
                                "
                            >
                                You haven't placed any orders yet.
                            </p>
                        }

                        {/* order preview list */}
                        {
                            ordersData?.data?.orders.length != 0 && 
                            <div
                                className="
                                mt-6
                            "
                            >
                                {/* order preview item*/}
                                {
                                    ordersData?.data?.orders?.map( function( order ) {
                                        let orderDate = new Date( order.createdAt ).toLocaleDateString( "en-US", {
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric"
                                        })

                                        return (
                                            <OrderPreview
                                                key={ order.id }
                                                orderId={ order.id }
                                                status={ order.status }
                                                shippingAddress={ order.shipping_address }
                                                orderDate={ orderDate }
                                                deliveryDate={ orderDate }   // same as order date for now ( mock app )
                                                totalPaid={`$${ order.price_at_purchase }`}
                                                paymentStatus={ order.payment_status }
                                                items={
                                                    order.products.map( function( product ) {
                                                        return {
                                                            title: product.title,
                                                            quantity: product.order_quantity,
                                                            price: product.price,
                                                            photoUrl: product.cover_photo_url
                                                        }
                                                    })
                                                }
                                            />
                                        )
                                    })
                                }
                            </div>
                        }

                        {/* load more orders button */}
                        {
                            ordersData?.data.orders.length < ordersData?.data.totalOrders && (
                                <Button
                                    className="
                                        flex!
                                        items-center
                                        gap-2
                                        mt-6
                                    "
                                    onClick={ handleLoadMoreOrders }
                                >
                                    <FaArrowRotateLeft 
                                        className={`
                                            ${
                                                ( isOrdersLoading || isOrdersFetching ) && 
                                                "animate-spin"
                                            }
                                            text-lg
                                        `}
                                    />

                                    load more orders
                                </Button>
                            )
                        }
                    </div>
                </section>
            </div>

            {/* profile photo update dialog */}
            <DialogComponent
                title="Update Profile Photo"
                description="Select a new profile photo to upload"
                open={ isPhotoUpdateDialogOpen }
                onOpenChange={ setIsPhotoUpdateDialogOpen }
            >
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={ (e) => setProfilePhoto( e.target.files[0] ) }
                    className="
                        block
                        w-full
                        outline-none focus-within:outline-[initial]
                        bg-instabooks-black
                        text-white
                        rounded-lg
                        px-4 py-2
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                    "
                    placeholder="Select a profile photo"
                    disabled={ isUpdateUserLoading }
                />

                { profilePhoto && 
                    <img 
                        src={ 
                            URL.createObjectURL(profilePhoto) 
                        } 
                        alt="Profile" 
                        className="
                            mt-4
                            w-full
                            h-80
                            object-cover
                            rounded-lg
                            block
                        "
                    /> 
                }

                <Button
                    className="mt-4 w-full"
                    onClick={ () => handleProfilePhotoUpdate() }
                >
                    {
                        isUpdateUserLoading ? "Uploading..." :
                        "Upload Photo"
                    }
                </Button>
            </DialogComponent>

            {/* address addition dialog */}
            <DialogComponent
                title="Add New Address"
                description="Enter the new address you want to add"
                open={ isAddressAdditionDialogOpen }
                onOpenChange={ setIsAddressAdditionDialogOpen }
            >
                <Form.Root onSubmit={ handleAddAddress }>
                    <TextField
                        name="newAddress"
                        label="New Address: "
                        valueMissingMessage="Address can't be empty"
                        required
                        value={ newAddress }
                        onChange={ (e) => setNewAddress( e.target.value ) }
                    />

                    <Form.Submit asChild>
                        <Button
                            className={`
                                capitalize 
                                mt-4
                                w-full
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            `}
                            disabled={ isAddAddressLoading }
                        >
                            {
                                isAddAddressLoading ? "Adding..." :
                                "Add Address"
                            }
                        </Button>
                    </Form.Submit>
                </Form.Root>
            </DialogComponent>
        </>
    );
}
