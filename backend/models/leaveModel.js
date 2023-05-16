const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    Subject: {
        type: String,
    },
    Type: {
        type: String,
    },
    Start: {
        type: Date,
    },
    End: {
        type: Date,
    },
    Reason: {
        type: String,
    },
    Manager: {
        type: mongoose.Schema.Types.ObjectId,
    },
    Employee: {
        type: mongoose.Schema.Types.ObjectId,
    },
    employeeEmail: {
        type: String,
    },
    managerEmail: {
        type: String,
    },
    approved:{
        type: String,
        default: false,
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Leave', leaveSchema)