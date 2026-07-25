import Intro from "../components/Intro";
import AltButton from "../../../shared/components/AltButton";
import { Link } from "react-router-dom";
import OrderDetails from "../components/OrderDetails";

export function Component() {
    return <div className="pb-12 lg:pb-8">
        {/* intro */}
        <Intro
            title="Manage orders"
        >
            <AltButton asChild>
                <Link to="/admin/books">
                    view books
                </Link>
            </AltButton>
        </Intro>

        {/* order management list */}
        <div 
            className="
                mt-8
                flex
                flex-col
                gap-4
            "
        >
            <OrderDetails 
                id="123456"
                status="pending"
                orderDate={ new Date() }
                totalAmount={ 59.99 }
                user={{
                    name: "John Doe",
                    email: "john.doe@example.com",
                }}
                paymentStatus="Paid"
                shippingAddress="123 Main St, City, Country"
                books={[
                    {
                        id: "1",
                        name: "Book Title 1",
                        order_quantity: 2,
                        price: 19.99,
                        cover_photo_url: "https://picsum.photos/200/300"
                    },
                    {
                        id: "2",
                        name: "Book Title 2",
                        order_quantity: 1,
                        price: 29.99,
                        cover_photo_url: "https://picsum.photos/200/300"
                    }
                ]}
            />
            
            <OrderDetails 
                id="123456"
                status="pending"
                orderDate={ new Date("2023-08-15") }
                totalAmount={ 59.99 }
                user={{
                    name: "John Doe",
                    email: "john.doe@example.com",
                }}
                paymentStatus="paid"
                shippingAddress="123 Main St, City, Country"
                books={[
                    {
                        id: "1",
                        name: "Book Title 1",
                        order_quantity: 2,
                        price: 19.99,
                        cover_photo_url: "https://picsum.photos/200/300"
                    },
                    {
                        id: "2",
                        name: "Book Title 2",
                        order_quantity: 1,
                        price: 29.99,
                        cover_photo_url: "https://picsum.photos/200/300"
                    }
                ]}
            />
        </div>
    </div>;
}