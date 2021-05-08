const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true

    },
    category: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,        
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    dist:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    date:{
        type:[String],
        required: true,
    },
    workers:{
        type:String,
    },
    description:{
        type:String,
    },
    status:{
        type:String
    },
    selected_date:{
        type:String
    },
    session_id:{
        type:String
    },
    payment_status:{
        type:String
    }
});
const OrderSchema = mongoose.model('Order', orderSchema);
module.exports = { Order: OrderSchema};