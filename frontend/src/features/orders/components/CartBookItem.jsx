import BookActions from "../../../shared/components/BookActions";

function CartBookItem({
    id,  // to be integrated with cart functionality in the future
    title = "Book title",
    price = 0,
    photoUrl = ""
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

            <div 
                className="
                    flex 
                    flex-col 
                    grow 
                    overflow-hidden
                "
            >
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
                
                <span>
                    Price: ${price.toFixed(2)}
                </span>
            </div>
        </div>

        <BookActions 
            className="
                md:ml-auto
            "
        />

        <span 
            className="
                text-xl
                font-medium
            "
        >
            {/* to be calculated using cart functionality later */}
            $10.00  
        </span>
    </div>;
}

export default CartBookItem;
