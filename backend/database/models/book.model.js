import mongoose from 'mongoose';

// Book Schema
// This schema defines the structure of the book documents 
// in the Instabooks MongoDB database. It includes fields for 
// title, description, pages, author, price, cover photo ID 
// and URL, quantity, and genre. The schema is used for storing 
// information about the books held in store, how many are available, 
// and the price of each book.
const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true,
        min: 1
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 2
    },
    cover_photo_id: {
        type: String,
        required: true
    },
    cover_photo_url: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    genre: String,
})


// Instance method to get book details without sensitive fields
// and return them directly back to the frontend.
BookSchema.methods.getBookDetails = function() {
    let { _id, __v, cover_photo_id, ...bookDetails } = this.toObject()

    return {
        id: this._id,
        ...bookDetails
    }
}


export default mongoose.model( "books", BookSchema )