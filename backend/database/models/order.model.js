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

export default mongoose.model("orders", orderSchema);
