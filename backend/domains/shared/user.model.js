import mongoose from 'mongoose';
import { ERROR_CODES } from './utils/errors.js';

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

UserSchema.methods.addToCart = async function( book_id, quantity ) {
    try {
        // get index of book with book_id if it has already been 
        // added to the cart
        let bookIndex = this.cart.findIndex( ( book ) => book.book_id === book_id )

        // if a valid book index was returned, update cart with
        // new quantity of the book, if not, add new book to user's
        // cart
        if ( bookIndex > 0 ) {
            this.cart[ bookIndex ].quantity = quantity
        } else {
            this.cart.unshift({
                book_id,
                quantity
            })
        }

        // save updated user document to the database
        await this.save()
    } catch( err ) {
        // if any errors occured during cart updates, tag the
        // error as a db operation error and throw it to the
        // higher try/catch block in the controller
        err.code = ERROR_CODES.DB_OPERATION_ERROR

        throw err
    }
}

const User = mongoose.model('Users', UserSchema)
export default User