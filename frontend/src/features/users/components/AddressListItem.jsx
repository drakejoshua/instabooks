import { FaCircleNotch, FaTrash } from "react-icons/fa6";

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
        <span>
            { address }
        </span>

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