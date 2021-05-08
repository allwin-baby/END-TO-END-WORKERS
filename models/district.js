const mongoose = require('mongoose');
const distSchema = new mongoose.Schema({
    district: {
        type: String,
        required: true
    },
    
});
const DistSchema = mongoose.model('District', distSchema);
module.exports = { District: DistSchema};