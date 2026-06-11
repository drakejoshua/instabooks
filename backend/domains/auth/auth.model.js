import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    addresses: {
        type: [String],
        default: [],
    },
    photo_url: {
        type: String,
        default: '',
    },
    photo_id: {
        type: String,
        default: '',
    },
    cart: {
        type: [{
            book_id: mongoose.Schema.Types.ObjectId,
            quantity: Number
        }]
    }
})

const User = mongoose.model('User', UserSchema)
export default User