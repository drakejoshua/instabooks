import { FaCircleNotch, FaTrash } from "react-icons/fa6";


// AddressListItem component
// This component displays a single address in the user's 
// address list. It includes the address text and a delete 
// button to remove the address from the list.


export function AddressListItem({ 
    address = "",
    handleDeleteAddress = () => {},
    deleteLoading = false
}) {
    return <div
        className="
            flex
            gap-4
            items-center
            justify-between
            outline-2
            outline-instabooks-blue
            px-4 py-3
            rounded-md
        "
    >
        {/* address text */}
        <span>
            { address }
        </span>

        {/* delete button */}
        <button
            className="
                cursor-pointer disabled:cursor-not-allowed
                disabled:opacity-70
            "
            onClick={ handleDeleteAddress }
            disabled={ deleteLoading }
        >
            {
                deleteLoading ? (
                    // loading spinner icon displayed 
                    // while the address is being deleted
                    <FaCircleNotch 
                        className="
                            animate-spin 
                            text-instabooks-blue
                        "
                    />
                ) : (
                    <FaTrash className="text-instabooks-blue"/>
                )
            }
        </button>
    </div>
}