import mongoose from "mongoose";

// Order Schema
// This schema defines the structure of the order documents 
// in the Instabooks MongoDB database. It includes fields for
// user ID, status, price at purchase, shipping address, payment status,
// and products. The schema is used for storing information about the 
// orders placed by users, including the books ordered and their quantities.

// Quick note: Orders in the application aren't real orders. Orders become
// "shipped" when the user has paid for the order, and "cancelled" when the
// user has cancelled the order. The "pending" status is used for orders that
// are still being processed and haven't been paid for yet. There's no 
// admin control over the order status, as the status is automatically 
// updated based on user actions.
let orderSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        status: {
            type: String,
            enum: ["shipped", "pending", "cancelled"],
            default: "pending",
            required: true,
        },
        price_at_purchase: {
            type: Number,
            required: true,
        },
        shipping_address: {
            type: String,
            required: true,
        },
        payment_status: {
            type: String,
            required: true,
            enum: ["pending", "paid", "failed"],
        },
        products: [
            {
                book_id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "books",
                    required: true,
                },
                order_quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

// getOrderDetails()
// This is a method that retrieves the details of the current
// order stripping out sensitive fields from the user and book documents. It returns
// an object containing the order details, including the order ID, products, 
// user ID, and other relevant information. The method uses Mongoose's populate
// function to retrieve the related book and user documents based on their IDs.
orderSchema.methods.getOrderDetails = async function () {
    await this.populate([ "products.book_id", "user_id" ])
    let { _id, __v, products, user_id, ...orderDetails } = this.toObject();

    let { 
        _id: userId,
        __v: userVersion, 
        google_auth_id,
        refresh_token,
        photo_id,
        ...userDetails 
    } = user_id;

    let leanProducts = products.map((product) => {
        let { 
            _id,
            __v, 
            cover_photo_id,
            quantity,
            ...bookDetails 
        } = product.book_id || {};

        return {
            id: _id,
            ...bookDetails,
            order_quantity: product.order_quantity,
        };
    });

    return {
        id: _id,
        products: leanProducts,
        user_id: {
            id: userId,
            ...userDetails
        },
        ...orderDetails,
    };
};

export default mongoose.model("orders", orderSchema);
