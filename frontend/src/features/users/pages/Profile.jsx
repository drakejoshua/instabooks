import { DropdownMenu, Form } from "radix-ui";
import TextField from "../../../shared/components/TextField";
import EmailField from "../../../shared/components/EmailField";
import Button from "../../../shared/components/Button";
import UserAvatar from "../../../shared/components/UserAvatar";
import { FaArrowRotateLeft, FaFileArrowUp, FaTrash } from "react-icons/fa6";
import { AddressListItem } from "../components/AddressListItem";
import { OrderPreview } from "../components/OrderPreview";
import Heading from "../../../shared/components/Heading";
import { useGetMeQuery, useUpdateUserMutation } from "../services/authApi";
import { useGetOrdersQuery } from "../../../shared/services/ordersApi";
import { useEffect, useState } from "react";
import { ToastTypes, useToastActions } from "../../../shared/ui/ToastRenderer";
import { DialogComponent, useDialogActions } from "../../../shared/ui/DialogRenderer";
import { useAddAddressMutation, useDeleteAddressMutation } from "../../../shared/services/userApi";
import ScrollSpy from 'react-scrollspy-navigation';
import { getErrorMessage } from "../../../shared/utils/utils";
import { logger } from "../../../infra/logging/logger";

export function Component() {
    // set the default limit for the number of orders 
    // to fetch per page
    const defaultLimit = 20

    // state for managing the current page of orders to
    // display on the user's profile
    const [ page, setPage ] = useState( 1 )
    
    // state for controlling the user's name input 
    // field in the profile form
    const [ name, setName ] = useState("")

    // state for controlling the profile photo update dialog
    // and the selected profile photo file
    const [ isPhotoUpdateDialogOpen, setIsPhotoUpdateDialogOpen ] = useState( false )
    const [ profilePhoto, setProfilePhoto ] = useState( null )

    // state for controlling the address addition dialog
    // and the new address input field
    const [ newAddress, setNewAddress ] = useState( "" )
    const [ isAddressAdditionDialogOpen, setIsAddressAdditionDialogOpen ] = useState( false )

    // get the authenticated user data using the useGetMeQuery hook
    const { data: user } = useGetMeQuery()

    // fetch the user's orders using the useGetOrdersQuery hook,
    // passing the current page and default limit as parameters.
    const { 
        data: ordersData, 
        isLoading: isOrdersLoading,
        isFetching: isOrdersFetching,
        error: ordersError
    } = useGetOrdersQuery({ limit: defaultLimit, page })

    // updateUser and useUpdateUserMutation to handle the 
    // updating of user profile information, including name 
    // and profile photo. It returns the updateUser function 
    // and the loading and error states for the mutation.
    const [ 
        updateUser, 
        { 
            isLoading: isUpdateUserLoading,
            error: updateUserError
        } 
    ] = useUpdateUserMutation()

    // deleteAddress and addAddress to handle the deletion 
    // and addition of user addresses, respectively.
    const [ 
        deleteAddress, 
        { 
            isLoading: isDeleteAddressLoading, 
            error: deleteAddressError 
        } 
    ] = useDeleteAddressMutation()
    const [ 
        addAddress, 
        { 
            isLoading: isAddAddressLoading,
            error: addAddressError
        } 
    ] = useAddAddressMutation()

    // get the openToast function from the useToastActions hook to
    // display toast notifications for success or error messages
    const { openToast } = useToastActions()
    
    // get the openDialog and closeDialog functions from 
    // the useDialogActions hook to display confirmation dialogs 
    // for actions like deleting profile photos or addresses, and 
    // to close those dialogs when necessary
    const { openDialog, closeDialog } = useDialogActions()

    // useEffect to set the user's name in the profile form
    // when the user data is fetched successfully. It updates 
    // the name state with the user's name from the fetched data.
    useEffect( function() {
        if ( user?.data?.name ) {
            setName( user?.data?.name )
        }
    }, [ user ])

    // log any errors that occur while fetching the user's orders
    // using the app's dedicated logger providing context about the
    // error, including the request ID and user ID for debugging and 
    // tracking
    if ( ordersError ) {
        // log the error using the app's dedicated logger
        logger.error(
            "Error fetching orders for user",
            ordersError,
            {
                requestId: ordersError?.requestId,
                userId: user?.data?.id
            }
        );
    }

    // handleLoadMoreOrders()
    // This function is responsible for loading more orders when the 
    // user requests it. It checks if the current number of orders 
    // displayed is less than the total number of orders available.
    //  If so, it increments the page state to fetch the next set of 
    // orders. This allows for pagination and ensures that users can 
    // view all their orders without overwhelming the interface with 
    // too much data at once.
    function handleLoadMoreOrders() {
        // perform bounds check to ensure that the 
        // next page of orders is within the total 
        // number of orders
        if ( ordersData?.data?.orders.length < ordersData?.data?.totalOrders ) {
            setPage(prev => prev + 1)
        }
    }

    // handleProfilePhotoDeletion()
    // This function is responsible for handling the deletion of the
    // user's profile photo. It calls the updateUser mutation with
    // the delete_photo flag set to true. If the deletion is successful,
    // it displays a success toast notification. If an error occurs during
    // the deletion process, it logs the error and opens a dialog to inform
    // the user of the failure, providing an option to retry the deletion.
    async function handleProfilePhotoDeletion() {
        try {
            // call the updateUser mutation to delete the profile photo
            await updateUser({
                delete_photo: true
            }).unwrap()

            // display a success toast notification upon successful deletion
            openToast({
                type: ToastTypes.success,
                message: "Profile photo deleted successfully"
            })
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error deleting user's profile photo",
                error,
                {
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            // open a dialog to inform the user of the deletion 
            // failure and provide an option to retry
            let dialogId = openDialog({
                title: "Profile Photo Deletion Error",
                description: `An error occured while trying to delete
                your profile photo. Error: ${ 
                    getErrorMessage( updateUserError || error )
                }`,
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

    // confirmProfilePhotoDeletion()
    // This function is responsible for confirming the deletion 
    // of the user's profile photo. It opens a confirmation dialog 
    // asking the user if they are sure they want to delete their 
    // profile photo. If the user confirms, it calls the 
    // handleProfilePhotoDeletion function to proceed with the 
    // deletion. This provides a safeguard against accidental 
    // deletions by requiring user confirmation before performing the action.
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

        // validate that the name field is not empty 
        // before proceeding with the update
        if ( !name ) {
            return openToast({
                type: ToastTypes.error,
                message: "Name can't be empty or needs to be changed before updating profile info"
            })
        }

        try {
            // call the updateUser mutation to update the 
            // user's profile info with the new name
            await updateUser({
                name
            }).unwrap()

            // display a success toast notification upon 
            // successful update
            openToast({
                type: ToastTypes.success,
                message: "Profile info updated successfully"
            })
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error updating user's profile info",
                error,
                {
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            // open a dialog to inform the user of the update failure and
            // provide an option to retry the profile info update. 
            let dialogId = openDialog({
                title: "Profile Info Update Error",
                description: `An error occured while trying to update
                your profile info. Error: ${ 
                    getErrorMessage( updateUserError || error )
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

    // handleDeleteAddress()
    // This function is responsible for handling the 
    // deletion of a user's address. It takes an address as 
    // an argument and attempts to delete it using the 
    // deleteAddress mutation. If the deletion is successful, 
    // it displays a success toast notification. If an error 
    // occurs during the deletion process, it logs the error 
    // and opens a dialog to inform the user of the failure, 
    // providing an option to retry the deletion. 
    async function handleDeleteAddress( address ) {
        try {
            // call the deleteAddress mutation to delete 
            // the specified address
            await deleteAddress( address ).unwrap()

            // display a success toast notification upon 
            // successful deletion
            openToast({
                type: ToastTypes.success,
                message: "Address deleted successfully"
            })
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error deleting user's address",
                error,
                {
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            // open a dialog to inform the user of the deletion failure and
            // provide an option to retry the address deletion.
            let dialogId = openDialog({
                title: "Address Deletion Error",
                description: `An error occured while trying to delete
                this address. Error: ${ getErrorMessage( deleteAddressError || error ) }`,
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

    // confirmAddressDeletion()
    // This function is responsible for confirming the deletion
    // of a user's address. It opens a confirmation dialog asking the
    // user if they are sure they want to delete the specified address.
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

    // handleAddAddress()
    // This function is responsible for handling the addition 
    // of a new address to the user's profile. It validates 
    // that the new address is not empty before proceeding 
    // with the addition. If the address is valid, it calls 
    // the addAddress mutation to add the new address. Upon 
    // successful addition, it displays a success toast notification. 
    // If an error occurs during the addition process, it logs the 
    // error and opens a dialog to inform the user of the failure, 
    // providing an option to retry adding the address.
    async function handleAddAddress( event ) {
        // prevent default form submission behaviour
        event?.preventDefault()

        // validate that the new address is not empty before proceeding
        if ( !newAddress ) {
            return openToast({
                type: ToastTypes.error,
                message: "Address can't be empty"
            })
        }

        try {
            // call the addAddress mutation to add the new address
            await addAddress( newAddress ).unwrap()

            // display a success toast notification upon successful addition
            openToast({
                type: ToastTypes.success,
                message: "Address added successfully"
            })
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error adding new address for user",
                error,
                {
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            // open a dialog to inform the user of the addition 
            // failure and provide an option to retry adding the address.
            let dialogId = openDialog({
                title: "Address Addition Error",
                description: `An error occured while trying to add
                this address. Error: ${ 
                    getErrorMessage( addAddressError || error )
                }`,
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
            // close the address addition dialog and reset 
            // the new address input field
            setIsAddressAdditionDialogOpen( false )
            setNewAddress( "" )
        }
    }

    // handleProfilePhotoUpdate()
    // This function is responsible for handling the update 
    // of the user's profile photo. It checks if a profile 
    // photo has been selected before proceeding with the 
    // update. If a photo is selected, it calls the updateUser 
    // mutation to upload the new profile photo. Upon 
    // successful update, it displays a success toast 
    // notification. If an error occurs during the update 
    // process, it logs the error and opens a dialog to inform 
    // the user of the failure, providing an option to retry 
    // the profile photo update.
    async function handleProfilePhotoUpdate() {
        // validate that a profile photo has been selected 
        // before proceeding
        if ( !profilePhoto ) {
            return openToast({
                type: ToastTypes.error,
                message: "Please select a profile photo to upload"
            })
        }

        try {
            // call the updateUser mutation to upload the new 
            // profile photo
            await updateUser({
                photo: profilePhoto
            }).unwrap()

            // display a success toast notification upon successful update
            openToast({
                type: ToastTypes.success,
                message: "Profile photo updated successfully"
            })
        } catch( error ) {
            // log the error using the app's dedicated logger
            logger.error(
                "Error updating user's profile photo",
                error,
                {
                    requestId: error?.requestId,
                    userId: user?.data?.id
                }
            )

            // open a dialog to inform the user of the update failure and
            // provide an option to retry the profile photo update.
            let dialogId = openDialog({
                title: "Profile Photo Update Error",
                description: `An error occured while trying to update
                your profile photo. Error: ${ 
                    getErrorMessage( updateUserError || error )
                }`,
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
            // close the profile photo update dialog and reset
            // the profile photo state to null after the update attempt
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
                {/* Profile Navigation */}
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
                    *:rounded-lg
                "
                >
                    {/* 
                        Profile Navigation Links - includes a scrollspy 
                        to track the functionality of the links and highlight 
                        the active section as the user scrolls through the 
                        profile page guiding the user through the different 
                        sections of their profile
                    */}
                    <ScrollSpy
                        activeClass="
                            bg-instabooks-blue
                            text-white
                        "
                    >
                        <a href="#profile">profile</a>

                        <a href="#orders">orders</a>
                    </ScrollSpy>
                </aside>

                {/* Profile Content */}
                <section
                    className="
                    max-w-lg
                "
                >
                    {/* Profile Section */}
                    <div>
                        <Heading as="h2" id="profile">your profile</Heading>

                        {/* Profile Photo Dropdown */}
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                {/* Profile photo avatar */}
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
                                {/* dropdown options */}
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
                                    {/* upload new photo option */}
                                    <DropdownMenu.Item
                                        onSelect={ () => setIsPhotoUpdateDialogOpen( true ) }
                                    >
                                        <FaFileArrowUp />
                                        upload new photo
                                    </DropdownMenu.Item>

                                    {/* remove photo option */}
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

                            {/* submit button */}
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
                                    user?.data?.addresses?.length === 0 && (
                                        <p className="text-gray-600">
                                            You haven't saved any addresses yet.
                                        </p>
                                    )
                                }
                            </div>

                            {/* add new address button */}
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

                    {/* Orders Section */}
                    <div>
                        <Heading className="mt-12" id="orders">your orders</Heading>

                        {
                            // empty orders message displayed when the user 
                            // has not placed any orders yet
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
                            // display the list of orders if there are any 
                            // orders available/placed by the user
                            ordersData?.data?.orders.length != 0 && 
                            <div
                                className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                            "
                            >
                                {/* order preview item*/}
                                {
                                    // map through the user's orders and render an OrderPreview
                                    // component for each order in the list 
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
                                                    // map over the products in the order and return an array of objects
                                                    // to specifically the format for the OrderPreview component, 
                                                    // containing the title, quantity, price, and photoUrl 
                                                    // of each product
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
                            // only display the button when there are more orders to load, i.e., when the number of
                            // orders displayed is less than the total number of orders available for the user
                            ordersData?.data.orders.length < ordersData?.data.totalOrders && (
                                <Button
                                    className="
                                        flex!
                                        items-center
                                        gap-2
                                        mt-6
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                    onClick={ handleLoadMoreOrders }
                                    disabled={ isOrdersLoading || isOrdersFetching }
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
                {/* file input for selecting a new profile photo */}
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

                {/* profile photo preview */}
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

                {/* upload button */}
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
                    {/* address input field */}
                    <TextField
                        name="newAddress"
                        label="New Address: "
                        valueMissingMessage="Address can't be empty"
                        required
                        value={ newAddress }
                        onChange={ (e) => setNewAddress( e.target.value ) }
                    />

                    {/* submit button */}
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
