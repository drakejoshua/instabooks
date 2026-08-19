import { Collapsible } from "radix-ui";
import { useState } from "react";
import { FaArrowsRotate, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa6";
import { InfoList } from "../../../shared/components/InfoList";
import OrderDetailsItem from "../../../shared/components/OrderDetailsItem";
import Button from "../../../shared/components/Button";
import AltButton from "../../../shared/components/AltButton";
import Badge from "../../../shared/components/Badge";

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
    return (
        <Collapsible.Root>
            <div
                className="
                    bg-gray-100
                    p-5 py-6
                    rounded-xl
                "
            >
                {/* order id and status */}
                <Collapsible.Trigger
                    className="
                        flex
                        items-center
                        gap-3
                        w-full
                        group
                    "
                >
                    <FaChevronUp 
                        className="
                            group-data-[state=open]:rotate-0
                            transition-transform
                            duration-300
                            group-data-[state=closed]:rotate-180
                        "
                    />
                    

                    <span
                        className="
                            font-medium
                            text-lg
                        "
                    >
                        Order ID: #{ orderId }
                    </span>

                    <Badge
                        className="
                            ml-auto
                        "
                    >
                        { status }
                    </Badge>
                </Collapsible.Trigger>

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
                            items.map((item) => (
                                <OrderDetailsItem
                                    key={ item.id }
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
                        { paymentStatus != "paid" && <Button>
                            <FaArrowsRotate />

                            revalidate order
                        </Button>}

                        { status != "cancelled"  && <AltButton>
                            <FaTrash />

                            cancel order
                        </AltButton>}
                    </div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    )
}