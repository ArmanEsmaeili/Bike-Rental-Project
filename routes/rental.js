const express = require('express');
const Rental = require('../models/Rental');
const Bike = require('../models/Bike');
const moment = require('moment-timezone');
const jalaali = require('jalaali-js');

const router = express.Router();

router.post('/rent', async (req, res) => {
    try {
        const { user, bike, branchFrom, branchTo, startTime, endTime } = req.body;
        console.log("renting now  ", startTime)
        const bikeData = await Bike.findById(bike);
        if (!bikeData || !bikeData.available) {
            return res.status(400).json({ error: 'Bike not available' });
        }

        const hours = (new Date(endTime) - new Date(startTime)) / 3600000;
        const totalPrice = hours * bikeData.pricePerHour;

        const rental = new Rental({
            user, bike, branchFrom, branchTo, startTime, endTime, totalPrice,
            rentalCode: Math.random().toString(36).substr(2, 9)
        });

        await rental.save();
        res.status(201).json({ rentalCode: rental.rentalCode });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID from route parameters

        // Find rentals for the user and populate foreign keys
        const rentals = await Rental.find({ user: userId })
            .populate('bike') // Populate bike details
            .populate('branchFrom') // Populate branchFrom details
            .populate('branchTo'); // Populate branchTo details

        if (!rentals.length) {
            return res.status(404).json({ message: 'No rentals found for this user.' });
        }

        const jalaliRentals = rentals.map(rental => {
            const startDate = new Date(rental.startTime);
            const endDate = new Date(rental.endTime);

            const jStartTime = toJalali(startDate); // Convert to Jalali
            const jEndTime = toJalali(endDate); // Convert to Jalali

            return {
                ...rental._doc, // Spread existing rental data
                startTime: jStartTime,
                endTime: jEndTime
            };
        });

        res.json(jalaliRentals); // Return the rentals with populated data
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
 
// Persian month names
const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const toJalali = (utcDateTime)=>{
    // Convert UTC datetime to +3:30 timezone (Tehran timezone)
    const tehranDateTime = moment.utc(utcDateTime).tz('Asia/Tehran').format('YYYY-MM-DD HH:mm:ss');

    // Extract year, month, day, hour, minute, and second from the converted datetime
    const [year, month, day, hour, minute, second] = tehranDateTime.match(/\d+/g);

    // Convert Gregorian date to Jalali date
    const jalaliDate = jalaali.toJalaali(parseInt(year), parseInt(month), parseInt(day));

    // Get the Persian month name
    const persianMonthName = persianMonths[jalaliDate.jm - 1]; // Subtract 1 because array is zero-indexed

    // Format the Jalali datetime with Persian month name
    const jalaliDateTime = `${hour}:${minute}:${second} ${jalaliDate.jd} ${persianMonthName} ${jalaliDate.jy}`;
    return jalaliDateTime
} 

module.exports = router;