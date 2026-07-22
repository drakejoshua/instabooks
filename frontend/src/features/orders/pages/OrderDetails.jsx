import { Link, useParams } from "react-router-dom"
import Button from "../../../shared/components/Button"
import { FaArrowLeft, FaArrowRotateRight, FaCircleNotch } from "react-icons/fa6"
import AnimatedCheckIcon from "../../../shared/components/AnimatedCheckIcon.jsx"
import AnimatedWarningIcon from "../../../shared/components/AnimatedWarningIcon.jsx"
import Heading from "../../../shared/components/Heading.jsx"
import OrderDetailsItem from "../../../shared/components/OrderDetailsItem.jsx"

export function Component() {
    let state = "loaded"
    let { id } = useParams()

    let iconStyle = `
        text-6xl
        block
        mx-auto
        mt-16
        text-instabooks-blue
    `;

    let buttonStyle = `
        mt-10
        block
        mx-auto
        flex
        gap-2
        items-center
        capitalize
    `;

    return <div
        className="
            w-full
            max-w-lg
            mx-auto
            pt-2 px-6 pb-4 lg:px-2
        "
    >
        {/* loading state */}
        { state === "loading" && <div>
            {/* TODO: to be replaced with animated loading icon */}
            <FaCircleNotch className={iconStyle + "animate-spin"} />

            <Heading variant="route">
                We're fetching your order information
            </Heading>

            <p
                className="
                    text-center
                    mt-4
                "
            >
                If your confirmation isn't completed within a few 
                seconds, please check your internet connection and 
                try again.
            </p>
        </div>}
        
        {/* error state */}
        { state === "error" && <div>
            <AnimatedWarningIcon />

            <Heading variant="route">
                Error verifying the order ID: #{ id }
            </Heading>

            <p
                className="
                    text-center
                    mt-4
                "
            >
                Please check your internet connection and try again.
                You can try fetching your order information again
                by clicking the button below.
            </p>

            <Button
                className={ buttonStyle }
            >
                <FaArrowRotateRight />
                refresh order information
            </Button>
        </div>}

        {/* loaded state */}
        { state === "loaded" && <div>
            <AnimatedCheckIcon />

            <Heading variant="route">
                Order ID details: #{ id }
            </Heading>

            <p
                className="
                    text-center
                    mt-4
                "
            >
                Your order status is: {"pending"} and is expected 
                to be delivered on: {"2024-06-30"}
            </p>

            <div
                className="
                    mt-4
                    rounded-lg
                    p-3
                    bg-gray-100
                    max-h-48
                "
            >
                <OrderDetailsItem 
                    bookName="The Great Gatsby"
                    quantity={ 1 }
                    price={ 100 }
                    photoUrl={"https://picsum.photos/id/24/400"}
                />
            </div>

            <Button
                className={ buttonStyle }
            >
                <FaArrowLeft />
                <Link to="..">
                    Go back to home
                </Link>
            </Button>
        </div>}
    </div>
}
