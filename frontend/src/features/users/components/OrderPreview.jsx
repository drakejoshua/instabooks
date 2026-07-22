import { Collapsible } from "radix-ui";
import { useState } from "react";
import { FaArrowsRotate, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa6";
import { InfoList } from "../../../shared/components/InfoList";
import OrderDetailsItem from "../../orders/components/OrderDetailsItem";
import Button from "../../../shared/components/Button";
import AltButton from "../../../shared/components/AltButton";

export function OrderPreview({ 
    orderId, 
    status, 
    shippingAddress, 
    orderDate, 
    deliveryDate, 
    totalPaid, 
    paymentStatus,
    items
}) {
    const [open, setOpen] = useState(false);

    return (
        <Collapsible.Root
            open={open}
            onOpenChange={setOpen}
        >
            <div
                className="
                    bg-gray-100
                    p-5 py-6
                    rounded-xl
                "
            >
                {/* order id and status */}
                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <Collapsible.Trigger>
                        {
                            open ?
                            <FaChevronUp /> :
                            <FaChevronDown />
                        }
                    </Collapsible.Trigger>

                    <span
                        className="
                            font-medium
                            text-lg
                        "
                    >
                        Order ID: #{ orderId }
                    </span>

                    <span 
                        className="
                            capitalize
                            bg-instabooks-blue
                            font-medium
                            text-white
                            px-3.5 py-0.5
                            rounded-full
                            ml-auto
                            inline-block
                        "
                    >
                        { status }
                    </span>
                </div>

                {/* shipping address */}
                <p
                    className="
                        mt-1
                    "
                >
                    { shippingAddress }
                </p>

                <Collapsible.Content>
                    {/* order metadata */}
                    <InfoList 
                        entries={{
                            "order date": orderDate,
                            "delivery date": deliveryDate,
                            "total paid": totalPaid,
                            "payment status": paymentStatus
                        }}
                        className="mt-4"
                    />

                    {/* order items */}
                    <div
                        className="
                            mt-4
                        "
                    >
                        {
                            items.map((item, index) => (
                                <OrderDetailsItem
                                    key={ index }
                                    bookName={ item.title }
                                    quantity={ item.quantity }
                                    price={ item.price }
                                    photoUrl={ item.photoUrl }
                                />
                            ))
                        }
                    </div>

                    {/* order actions */}
                    <div 
                        className="
                            flex
                            gap-3
                            mt-12
                            flex-wrap

                            *:flex
                            *:items-center
                            *:gap-3
                            *:capitalize
                            *:px-4 *:py-2
                        "
                    >
                        <Button>
                            <FaArrowsRotate />

                            revalidate order
                        </Button>

                        <AltButton>
                            <FaTrash />

                            cancel order
                        </AltButton>
                    </div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    )
}