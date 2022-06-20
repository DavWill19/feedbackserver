const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeesSchema = new Schema({
    firstname: {
        type: String,
        default: "",
    },
    site: {
        type: String,
        default: "",
    },
    lastname: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        default: Date.now 
    },
    lastReview: {
        type: Date,
        default: Date.now
    },
    nextReview: {
        type: Date,
        default: Date.now
    },
    firstReview: {
        type: Boolean,
        default: false
    },
    history: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
}
);

const Employee = mongoose.model('Employees', employeesSchema);

module.exports = Employee;