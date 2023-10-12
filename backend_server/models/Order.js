const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,

    },
    startDateTime: {
        type: Date,

    },
    endDateTime: {
        type: Date,
    },
    rentAmount: {
        type: Number,
    },
    securityDepositAmount: {
        type: Number,
    }
    
});

module.exports=mongoose.model("Order", OrderSchema);

