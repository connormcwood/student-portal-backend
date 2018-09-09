const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true},
    score: { type: Number, default: 0 }
});

module.exports = mongoose.model('Grade', gradeSchema);