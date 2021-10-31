const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        storeEmail: {
            type: String,
            required: false,
        },
        date: {
            type: String,
            required: false,
        },
        survey: {
            type: String,
            required: false,
        },
        store: {
            type: String,
            required: false,
        },
        contact: {
            type: String,
            required: false,
        },
        comments: {
            type: String,
            required: false,
        },
        question1: {
            type: String,
            required: true,
        },
        question2: {
            type: String,
            required: true,
        },
        question3: {
            type: String,
            required: true,
        },
        question4: {
            type: String,
            required: true,
        },
        question5: {
            type: String,
            required: true,
        },
        question6: {
            type: String,
            required: true,
        },
        question7: {
            type: String,
            required: true,
        },
        question8: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const Form = mongoose.model('Form', formSchema);

module.exports = Form;