// OrderDetailsItem component
// This component is responsible for rendering the details of a single 
// item in an order. It accepts props such as bookName, quantity, price, 
// and photoUrl to display the relevant information about the ordered item. 
// The component uses a flex layout to arrange the item's image, name, 
// quantity, and price in a visually appealing manner.

function OrderDetailsItem(
    { bookName, quantity, price, photoUrl }
) {
    return <div
        className="
            flex
            items-center
            gap-4
            hover:bg-gray-200
            p-2 lg:px-3 
            rounded-lg
        "
    >
        <img 
            src={ photoUrl }
            alt="product image" 
            className="
                w-13 
                h-15 
                shrink-0
                rounded-lg 
                object-cover 
                outline-2
                outline-instabooks-blue
            "
        />

        <div>
            <h2
                className="
                    font-medium
                    lg:text-lg
                    text-instabooks-black
                    line-clamp-1
                "
            >
                { bookName }
            </h2>

            <p>
                { quantity } pcs
            </p>
        </div>

        <span
            className="
                ml-auto
                font-semibold
                text-instabooks-black
                text-xl lg:text-2xl
            "
        >
            ${ price }
        </span>
    </div>;
}

export default OrderDetailsItem;
