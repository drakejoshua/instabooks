import { FaTrash } from "react-icons/fa6";

export function AddressListItem({ address }) {
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
            className="cursor-pointer"
        >
            <FaTrash className="text-instabooks-blue"/>
        </button>
    </div>
}