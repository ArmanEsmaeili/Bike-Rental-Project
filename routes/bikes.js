const express = require('express');
const Bike = require('../models/Bike');

const router = express.Router();

// دریافت لیست دوچرخه‌های موجود
router.get('/', async (req, res) => {
    try {
        const branch = req.query.branch;
        let bikes = []
        if (branch){
            bikes = await Bike.find({
                available: true,
                location: branch
            })
        }else {
            bikes = await Bike.find({ available: true });
        }
        res.json(bikes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// اضافه کردن یک دوچرخه جدید (برای مدیریت)
router.post('/', async (req, res) => {
    try {
        const { model, pricePerHour } = req.body;
        const bike = new Bike({ model, pricePerHour, available: true });
        await bike.save();
        res.status(201).json(bike);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// const bikes = [
//     {model:'جاده ای', pricePerHour:'20', location: '67adf4d4eaf99a45c9a20518'},
//     {model:'کوهستان', pricePerHour:'35', location: '67adf4d4eaf99a45c9a20519'},
//     {model:'کودک', pricePerHour:'15', location: '67adf4d4eaf99a45c9a2051a'},
//     {model:'دو نفره', pricePerHour:'25', location: '67adf4d4eaf99a45c9a2051e'},
//     {model:'برقی', pricePerHour:'35', location: '67adf4d4eaf99a45c9a2051a'},
//     {model:'هیبریدی', pricePerHour:'35', location: '67adf4d4eaf99a45c9a20519'},
//     {model:'کوهستان', pricePerHour:'35', location: '67adf4d4eaf99a45c9a2051c'},
//     {model:'برقی', pricePerHour:'20', location: '67adf4d4eaf99a45c9a20518'},
//     {model:'جاده ای', pricePerHour:'20', location: '67adf4d4eaf99a45c9a20518'},
//     {model:'کوهستان', pricePerHour:'35', location: '67adf4d4eaf99a45c9a20519'},
//     {model:'کودک', pricePerHour:'15', location: '67adf4d4eaf99a45c9a2051a'},
//     {model:'دو نفره', pricePerHour:'25', location: '67adf4d4eaf99a45c9a2051e'},
//     {model:'برقی', pricePerHour:'35', location: '67adf4d4eaf99a45c9a2051a'},
//     {model:'هیبریدی', pricePerHour:'35', location: '67adf4d4eaf99a45c9a20519'},
//     {model:'کوهستان', pricePerHour:'35', location: '67adf4d4eaf99a45c9a2051c'},
//     {model:'برقی', pricePerHour:'20', location: '67adf4d4eaf99a45c9a20518'},
// ] 
// router.get('/dummy', async(req, res)=>{
//     try {
//         const savePromises = bikes.map(bikeData => {
//             const bike = new Bike({
//                 model: bikeData.model,
//                 pricePerHour: bikeData.pricePerHour,
//                 location: bikeData.location
//             });
//             return bike.save(); // Return the Promise
//         });

//         // Wait for all the save operations to complete
//         await Promise.all(savePromises);
//         res.status(201).json({'success':'yes'});
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })

module.exports = router;