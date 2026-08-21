import { FaCartArrowDown } from "react-icons/fa6";

export default function EmptyCartMessage() {
    return (
        <div 
            className="
                flex
                items-center
                justify-center
                gap-2
                mt-6
            "
        >
            <FaCartArrowDown className="text-xl text-gray-600"/>

            <span>
                You don't have any items in your cart
            </span>
        </div>
    );
}
