const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    code: {type: String, required: true},
    moduleImage: {type: String}
});

module.exports = mongoose.model('Module', moduleSchema);