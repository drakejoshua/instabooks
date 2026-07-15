import mongoose from 'mongoose';

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


BookSchema.methods.getBookDetails = function() {
    let { _id, __v, cover_photo_id, ...bookDetails } = this.toObject()

    return {
        id: this._id,
        ...bookDetails
    }
}


export default mongoose.model( "books", BookSchema )