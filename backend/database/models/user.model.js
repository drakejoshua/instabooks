import mongoose from "mongoose";
import { ERROR_CODES } from "../../domains/shared/utils/errors.js";


// User Schema
// This schema defines the structure of the user documents 
// in the Instabooks MongoDB database. It includes fields for
// name, email, addresses, photo URL and ID, cart, Google auth ID,
// and refresh token. The schema is used for storing information
// about the users of the application, including their personal
// details, addresses, and cart contents.

// The cart is held as part of the user document due to the fact 
// that it is a temporary storage of books that the user intends 
// to purchase and is always requested alongside the user profile data. 
// The cart is also not a large data structure that may require pagination 
// or other optimizations, so it is more efficient to store it
// within the user document rather than as a separate collection. 
// This allows for faster retrieval of the cart data when the user 
// profile is requested, and simplifies the data model by keeping 
// related information together in a single document.
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
        default: "",
    },
    photo_id: {
        type: String,
        default: "",
    },
    cart: {
        type: [
            {
                book_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "books",
                },
                order_quantity: Number,
            },
        ],
    },
    google_auth_id: {
        type: String,
        default: "",
    },
    refresh_token: {
        type: String,
        default: "",
    },
});

// getProfileData()
// This method retrieves the user's profile data, including their
// name, email, photo URL, addresses, and cart. It populates the
// cart with book details before returning the data.
UserSchema.methods.getProfileData = async function () {
    // populate the user data with book details before 
    // returning the data
    await this.populate("cart.book_id");

    return {
        id: this._id,
        name: this.name,
        email: this.email,
        photo_url: this.photo_url,
        addresses: this.addresses,
        cart: this.cart.map( function( book ) {
            let { 
                __v, 
                _id, 
                cover_photo_id,
                ...bookDetails 
            } = book.book_id.toObject();
            let { order_quantity } = book;

            return {
                ...bookDetails,
                order_quantity,
                id: _id
            }

        })
    };
};


// getCartData()
// This method retrieves the user's cart data, including the book
// details and quantities. It populates the cart with book details
// before returning the data.
UserSchema.methods.getCartData = async function () {
    // populate the cart with book details before 
    // returning the data
    await this.populate("cart.book_id");

    return this.cart.map( function( book ) {
        // strip out the book id and other sensitive fields 
        // from the book document before returning the cart
        // data
        let { 
            __v, 
            _id, 
            cover_photo_id,
            ...bookDetails 
        } = book.book_id.toObject();
        let { order_quantity } = book;

        return {
            ...bookDetails,
            order_quantity,
            id: _id
        }

    })
}

// addToCart()
// This method adds a book to the user's cart. It checks if the
// book is already in the cart and updates the quantity if it is,
// or adds a new entry if it isn't. It saves the updated user
// document to the database and populates it before returning.
UserSchema.methods.addToCart = async function (book_id, quantity) {
    try {
        // get index of book with book_id if it has already been
        // added to the cart
        let bookIndex = this.cart.findIndex( function(book) {
            return book.book_id.equals(book_id);
        });

        // if a valid book index was returned, update cart with
        // new quantity of the book, if not, add new book to user's
        // cart
        if (bookIndex >= 0) {
            this.cart[bookIndex].order_quantity = quantity;
        } else {
            this.cart.unshift({
                book_id,
                order_quantity: quantity,
            });
        }

        // save updated user document to the database
        await this.save();
    } catch (err) {
        // if any errors occured during cart updates, tag the
        // error as a db operation error and throw it to the
        // higher try/catch block in the controller
        err.code = ERROR_CODES.DB_OPERATION_ERROR;

        throw err;
    }
};

// removeFromCart()
// This method removes a book from the user's cart. It checks if
// the book is in the cart and removes it if it is. It saves the
// updated user document to the database and populates it before
// returning.
UserSchema.methods.removeFromCart = async function (book_id) {
    try {
        let cartData = await this.getCartData() 

        // get index of book with book_id if it has already been
        // added to the cart
        let bookIndex = this.cart.findIndex((book) => book.book_id.equals(book_id));

        // if a valid book index was returned, update cart with
        // new quantity of the book, if not, add new book to user's
        // cart
        if (bookIndex >= 0) {
            this.cart.splice( bookIndex, 1 );

            // save updated user document to the database
            await this.save();
        }

        return cartData.find( function( book ) {
            return book.id == book_id
        })
    } catch (err) {
        // if any errors occured during cart updates, tag the
        // error as a db operation error and throw it to the
        // higher try/catch block in the controller
        err.code = ERROR_CODES.DB_OPERATION_ERROR;

        throw err;
    }
};

// addAddress()
// This method adds a new address to the user's account. It pushes
// the new address to the addresses array, saves the updated user
// document to the database, and returns the updated list of
// addresses.
UserSchema.methods.addAddress = async function (newAddress) {
    this.addresses.push(newAddress);

    await this.save();
};

// deleteAddress()
// This method removes an address from the user's account. It
// pulls the specified address from the addresses array, saves the
// updated user document to the database, and returns the updated
// list of addresses.
UserSchema.methods.deleteAddress = async function (newAddress) {
    this.addresses.pull(newAddress);

    await this.save();
};

// create a User model using the UserSchema and export it for use
// in other parts of the application
const User = mongoose.model("users", UserSchema);
export default User;
