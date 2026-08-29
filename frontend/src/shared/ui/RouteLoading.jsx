import { FaCircleNotch } from "react-icons/fa6";

// RouteLoading component
// This component is responsible for displaying a loading indicator 
// when a route is being loaded. It takes in an optional label prop 
// that can be used to customize the loading message displayed to the user.

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
