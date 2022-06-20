const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        type: {
            type: String,
            required: false,
        },
        store: {
            type: String,
            required: false,
        },
        questions: {
            type: Array,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;