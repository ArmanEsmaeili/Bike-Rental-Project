const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
    model: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    available: { type: Boolean, default: true },
    location: {type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true}
});

module.exports = mongoose.model('Bike', BikeSchema);