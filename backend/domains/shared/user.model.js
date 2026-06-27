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
        }],
        ref: "Books"
    },
    google_auth_id: {
        type: String,
        default: ""
    },
    refresh_token: {
        type: String,
        default: ""
    }
})

UserSchema.methods.getProfileData = function() {
    return {
        name: this.name,
        email: this.email,
        photo_url: this.photo_url,
        addresses: this.addresses,
        cart: this.cart
    }
}

const User = mongoose.model('Users', UserSchema)
export default User