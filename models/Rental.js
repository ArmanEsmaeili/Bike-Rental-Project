const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
    branchFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    branchTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    rentalCode: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rental', RentalSchema);