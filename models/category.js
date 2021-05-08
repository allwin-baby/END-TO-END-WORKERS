const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    
});
const CategorySchema = mongoose.model('Category', categorySchema);
module.exports = { Category: CategorySchema};