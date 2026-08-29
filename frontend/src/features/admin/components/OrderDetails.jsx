// import necessary libraries and components
import { Collapsible } from 'radix-ui'
import { FaChevronUp } from 'react-icons/fa6'
import Badge from '../../../shared/components/Badge'
import Heading from '../../../shared/components/Heading'
import { InfoList } from '../../../shared/components/InfoList'
import OrderDetailsItem from '../../../shared/components/OrderDetailsItem'


// OrderDetails component - This component is used to display the 
// details of an order in a collapsible format. It accepts various 
// props such as id, status, orderDate, totalAmount, user, paymentStatus, 
// shippingAddress, and books. The component uses the Collapsible component 
// from Radix UI to create a collapsible section that displays the order 
// details when expanded. The order details include user information and 
// a list of books associated with the order.


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
            {/* collapsible trigger */}
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
                    {/* collapsible trigger icon */}
                    <FaChevronUp 
                        className="
                            group-data-[state=open]:rotate-0
                            transition-transform
                            duration-300
                            group-data-[state=closed]:rotate-180
                        "
                    />

                    {/* order ID */}
                    <span
                        className="
                            font-medium
                            text-lg 
                        "
                    >
                        Order ID: { id }
                    </span>
                </div>

                {/* order date */}
                <span>
                    { orderDate.toLocaleString() }
                </span>

                {/* order total amount */}
                <span
                    className="
                        text-lg
                        font-medium
                    "
                >
                    ${ totalAmount.toFixed(2) }
                </span>

                {/* order status */}
                <Badge
                    className="
                        w-fit
                    "
                >
                    { status }
                </Badge>
            </Collapsible.Trigger>

            {/* collapsible content */}
            <Collapsible.Content
                className="
                    mt-4
                "
            >
                {/* user details */}
                <div>
                    {/* user information heading */}
                    <Heading
                        className="
                            text-xl
                            font-medium
                        "
                    >
                        user information
                    </Heading>

                    {/* user information - name, email, shipping address, payment status */}
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
