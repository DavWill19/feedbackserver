const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowSchema = new Schema(
    {
        borrowStore: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        loanStore: {
            type: String,
            required: true,
        },
        acknowledged: {
            type: Boolean,
            required: false,
            default: false,
        },
        item: {
            type: String,
            required: false,
        },
        case: {
            type: String,
            required: false,
        },
        bag: {
            type: String,
            required: false,
        },
        individual: {
            type: String,
            required: false,
        },

    },
    {
        timestamps: true,
    }
);

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;