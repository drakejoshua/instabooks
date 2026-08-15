import { FaCircleNotch } from "react-icons/fa6";

function RouteLoading({ label = "loading page information..." }) {
    return (
        <div
            className="
                flex
                gap-2
                items-center
                justify-center
                mt-4
            "
        >
            <FaCircleNotch
                className="
                    text-instabooks-blue
                    animate-spin
                    text-2xl
                "
            />

            <span>
                {label}
            </span>
        </div>
    );
}

export default RouteLoading;
