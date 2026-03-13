const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 1098
  }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
