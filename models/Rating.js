var mongoose = require('mongoose');

module.exports = mongoose.model('Rating', {
    _id: { type: String, required: true, index: { unique: true } },
    rt: {
        critics_rating: String,
        critics_score: Number,
        audience_rating: String,
        audience_score: Number
    }
});
