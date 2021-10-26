const mongoose = require('mongoose');

// defining schema
const textSchema = new mongoose.Schema({
    language:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    }
});

const Text = mongoose.model('text',textSchema);

module.exports = Text;