const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    attendance: {type: Number}
});

module.exports = mongoose.model('Student', studentSchema);