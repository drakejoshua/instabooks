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
            className="w-13 h-15 rounded-lg object-cover"
        />

        <div>
            <h2
                className="
                    font-medium
                    lg:text-lg
                    text-instabooks-black
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
