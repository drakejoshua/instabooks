import { Link, useParams } from "react-router-dom"
import Button from "../../../shared/components/Button"

export function Component() {
    let state = "loaded"
    let { id } = useParams()

    return <>
        {/* loading state */}
        { state === "loading" && <div>
            {/* TODO: to be replaced with animated loading icon */}
            <span> loading... </span>

            <h1>
                Hold on, we're fetching your order information
            </h1>

            <p>
                If your confirmation isn't completed within a few 
                seconds, please check your internet connection and 
                try again.
            </p>
        </div>}
        
        {/* error state */}
        { state === "error" && <div>
            {/* TODO: to be replaced with animated error icon */}
            <span> error... </span>

            <h1>
                There was an error verifying the order with
                the ID: { id }
            </h1>

            <p>
                Please check your internet connection and try again.
                You can try fetching your order information again
                by clicking the button below.
            </p>

            <Button>
                refresh order information
            </Button>
        </div>}

        {/* loaded state */}
        { state === "loaded" && <div>
            {/* TODO: to be replaced with animated confirmation icon */}
            <span> confirmed... </span>

            <h1>
                Order number: { id }
            </h1>

            <p>
                your order status is: {"pending"} and is expected 
                to be delivered on: {"2024-06-30"}
            </p>

            <div>
                <div>
                    <img src="https://picsum.photos/id/24/400" alt="product image" />

                    <div>
                        <h2>Product Name</h2>
                        <p>1 pcs</p>
                    </div>

                    <span>$100</span>
                </div>
            </div>

            <Button>
                <Link to="..">
                    Go back to home
                </Link>
            </Button>
        </div>}
    </>
}
