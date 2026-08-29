import BookActions from "../../../shared/components/BookActions";


// CartBookItem component - represents an individual book item in the cart.
// It displays the book's title, price, cover photo, and the total 
// price based on the order quantity. It also includes the BookActions 
// component for managing the book in the cart.


function CartBookItem({
    id,
    title = "Book title",
    price = 0,
    photoUrl = "",
    orderQuantity = 0,
}) {
    return <div
        className="
            flex
            items-center
            gap-6 md:gap-8
            justify-between
            bg-gray-100
            py-6 px-6 lg:py-4
            rounded-xl
            flex-wrap md:flex-nowrap
        "
    >
        <div
            className="
                flex
                items-center
                gap-4
                w-full md:max-w-[50%]
            "
        >
            {/* book cover photo */}
            <img 
                src={ photoUrl }
                alt={`book cover of ${title}`}
                className="
                    w-12
                    h-14
                    object-cover
                    shrink-0
                "
            />

            {/* book details */}
            <div 
                className="
                    flex 
                    flex-col 
                    grow 
                    overflow-hidden
                "
            >
                {/* book title */}
                <span
                    className="
                        font-medium
                        text-lg
                        text-ellipsis
                        overflow-hidden
                        whitespace-nowrap
                        min-w-0
                    "
                >
                    {title}
                </span>
                
                {/* book price */}
                <span>
                    Price: ${price.toFixed(2)}
                </span>
            </div>
        </div>

        {/* book actions */}
        <BookActions 
            id={id}
            className="
                md:ml-auto
            "
        />

        {/* total price */}
        <span 
            className="
                text-xl
                font-medium
            "
        >
            {/* total price is calculated using the book's price and order quantity */}
            ${ ( price * orderQuantity ).toFixed(2) }
        </span>
    </div>;
}

export default CartBookItem;
