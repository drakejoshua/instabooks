import { Collapsible } from 'radix-ui'
import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import Badge from '../../../shared/components/Badge'
import Heading from '../../../shared/components/Heading'
import { InfoList } from '../../../shared/components/InfoList'
import OrderDetailsItem from '../../../shared/components/OrderDetailsItem'

function OrderDetails({
    id = "",
    status = "",
    orderDate = new Date(),
    totalAmount = 0,
    user = {},
    paymentStatus = "",
    shippingAddress = "",
    books = []
}) {
    return (
        <Collapsible.Root
            className="
                bg-gray-100
                p-4 px-6
                rounded-lg
            "
        >
            <Collapsible.Trigger
                className="
                    flex
                    lg:items-center
                    justify-between
                    flex-col lg:flex-row
                    gap-2.5
                    group
                    w-full
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >
                    <FaChevronUp 
                        className="group-data-[state='open']:inline-block hidden"
                    /> 
                    <FaChevronDown 
                        className="group-data-[state='closed']:inline-block hidden"
                    />

                    <span
                        className="
                            font-medium
                            text-lg 
                        "
                    >
                        Order ID: { id }
                    </span>
                </div>

                <span>
                    { orderDate.toLocaleString() }
                </span>

                <span
                    className="
                        text-lg
                        font-medium
                    "
                >
                    ${ totalAmount.toFixed(2) }
                </span>

                <Badge
                    className="
                        w-fit
                    "
                >

                    { status }
                </Badge>
            </Collapsible.Trigger>

            <Collapsible.Content
                className="
                    mt-4
                "
            >
                {/* user details */}
                <div>
                    <Heading
                        className="
                            text-xl
                            font-medium
                        "
                    >
                        user information
                    </Heading>

                    <InfoList 
                        className="
                            mt-1
                        "
                        entries={{
                            name: user.name || "N/A",
                            email: user.email || "N/A",
                            'shipping address': shippingAddress || "N/A",
                            'payment status': paymentStatus || "N/A"
                        }}
                    />
                </div>

                {/* books list */}
                <div
                    className="
                        mt-6
                    "
                >
                    {
                        books.map((book) => (
                            <OrderDetailsItem
                                key={ book?.id }
                                bookName={ book?.name }
                                quantity={ book?.order_quantity }
                                price={ book?.price }
                                photoUrl={ book?.cover_photo_url }
                            />
                        ))
                    }
                </div>
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

export default OrderDetails
