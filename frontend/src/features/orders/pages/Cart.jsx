import { FaCartArrowDown } from "react-icons/fa6";
import Heading from "../../../shared/components/Heading";
import { useGetMeQuery } from "../../users/services/authApi";
import CartBookItem from "../components/CartBookItem";

export function Component() {
    // get user information through the redux query 
    // or from cache
    const { data: user } = useGetMeQuery()

    return <div>
        <Heading>
            Your cart
        </Heading>

        {/* cart empty list */}
        { user?.data?.cart?.length === 0 && 
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
        }

        {/* cart list */}
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
                user?.data?.cart.length != 0 && user?.data?.cart?.map( function(book) {
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
    </div>;
}
