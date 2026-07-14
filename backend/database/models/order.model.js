import mongoose from "mongoose";

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
// order
orderSchema.methods.getOrderDetails = async function () {
    let { _id, __v, products, user_id, ...orderDetails } = await this.populate([
        "products.book_id",
        "user_id",
    ]).toObject();

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
            ...bookDetails 
        } = product.book_id;

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
