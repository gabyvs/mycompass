var mongoose = require('mongoose');
module.exports = mongoose.model('wishes', {
    label : { type : String },
    category: { type: String },
    status: { type: String },
    description: { type: String },
    since: { type: Date },
    year: { type: Number },
    quarter: { type: Number },
    month: { type: Number },
    week: { type: Number },
    day: { type: Number },
    parent: { type: String }
});