import Heading from "../../../shared/components/Heading";
import { useGetMeQuery } from "../../users/services/authApi";
import CartBookItem from "../components/CartBookItem";
import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom"
import EmptyCartMessage from "../components/EmptyCartMessage";
import { calculateCartTotal } from "../utils/utils";

export function Component() {
    // get user information through the redux query 
    // or from cache
    const { data: user } = useGetMeQuery()

    return <div className="pb-6">
        <Heading>
            Your cart
        </Heading>

        {/* cart empty list */}
        { user?.data?.cart?.length === 0 && 
            <EmptyCartMessage />
        }

        {/* cart list */}
        {
            user?.data?.cart.length != 0 && <>
                <div
                className="
                    mt-6
                    flex
                    flex-col
                    gap-4
                    md:gap-6
                "
            >
                {/* book item */}
                {
                    user?.data?.cart?.map( function(book) {
                        return (
                            <CartBookItem
                                key={ book.id }
                                id={ book.id }
                                title={ book.title }
                                price={ book.price }
                                photoUrl={ book.cover_photo_url }
                                orderQuantity={ book.order_quantity }
                            />
                        )
                    })
                }
                </div>

                {/* cart total and checkout CTA */}
                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mt-10
                        flex-col md:flex-row
                        gap-3
                    "
                >
                    {/* total price */}
                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >
                        <span className="uppercase">
                            cart total
                        </span>

                        <span className="text-3xl font-medium">
                            ${
                                calculateCartTotal( user?.data?.cart )
                                    .toFixed(2)
                            }
                        </span>
                    </div>

                    {/* checkout CTA */}
                    <Button asChild className="capitalize">
                        <Link to="/orders/checkout">
                            checkout
                        </Link>
                    </Button>
                </div>
            </>
        }
    </div>;
}
