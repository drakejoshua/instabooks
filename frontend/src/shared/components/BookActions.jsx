import { FaMinus, FaPlus } from "react-icons/fa6";
import Button from "./Button";

export default function BookActions({ id, className = "" }) {
    return <div
        className={`
            ${className}
        `}
    >
        {true && 
            <Button
                className="
                    mt-8
                    block
                    w-fit
                "
            >
                Add to cart
            </Button>
        }

        { false && <div
            className="
                mt-8
                flex
                items-center
                gap-5
                justify-between
            "
        >
            <Button
                className="
                    px-2.5!
                "
            >
                <FaPlus />
            </Button>

            <span
                className="
                    text-xl
                    font-medium
                "
            >
                10
            </span>

            <Button
                className="
                    px-2.5!
                "
            >
                <FaMinus />
            </Button>
        </div>}
    </div>
}