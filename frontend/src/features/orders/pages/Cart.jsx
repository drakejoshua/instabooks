import Heading from "../../../shared/components/Heading";
import { useGetMeQuery } from "../../users/services/authApi";
import CartBookItem from "../components/CartBookItem";
import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom"
import EmptyCartMessage from "../components/EmptyCartMessage";
import { calculateCartTotal } from "../utils/utils";
import { trackViewCart } from "../../../infra/analytics/ecommerce";
import { useEffect } from "react";

// Cart page - displays the user's cart with a list of books, 
// their details, and the total price. It also includes a 
// checkout button for proceeding to the checkout page.


export function Component() {
    // get user information through the redux query 
    // or from cache
    const { data: user } = useGetMeQuery()

    // track the view cart event in google analytics when 
    // the component mounts and the cart data is available
    useEffect( function() {
        if ( !user?.data?.cart ) return;
        
        // send view cart event to google analytics
        trackViewCart( {
            currency: "USD",
            total: calculateCartTotal( user?.data?.cart ),
            items: user?.data?.cart.map( function(book) {
                return {
                    id: book.id,
                    title: book.title,
                    price: book.price,
                    quantity: book.order_quantity || 1
                }
            } ) 
        })
    }, [])

    return <div className="pb-6">
        {/* cart heading */}
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
                    // map through the user's cart and render a CartBookItem 
                    // component for each book in the cart
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
