const express = require('express');
const Branch = require('../models/Branch');

const router = express.Router();

// دریافت لیست شعبه‌ها
// GET /branches/withBikes?hasBike=true
router.get('/', async (req, res) => {
    try {
        const hasBike = req.query.hasBike === 'true'; // Convert string to boolean

        let branches;

        if (hasBike) {
            branches = await Branch.aggregate([
                {
                    $lookup: {
                        from: 'bikes',
                        localField: '_id',
                        foreignField: 'location',
                        as: 'bikes'
                    }
                },
                {
                    $match: {
                        'bikes.0': { $exists: true }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        location: 1
                    }
                }
            ]);
        } else {
            // Get all branches
            branches = await Branch.find();
        }

        res.json(branches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// اضافه کردن یک شعبه جدید (برای مدیریت)
router.post('/', async (req, res) => {
    try {
        const { name, location } = req.body;
        const branch = new Branch({ name, location });
        await branch.save();
        res.status(201).json(branch);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// const branches = [
//     {name:'پارک مردم', location: 'پارک مردم'},
//     {name:'اعتمادیه', location: 'اعتمادیه'},
//     {name:'بلوار جوان', location: 'بلوار جوان'},
//     {name:'فرهنگیان', location: 'فرهنگیان'},
//     {name:'میدان پژوهش', location: 'میدان پژوهش'},
//     {name:'سعیدیه', location: 'سعیدیه'},
//     {name:'گنجنامه', location: 'گنجنامه'},
//     {name:'آرامگاه بابا طاهر', location: 'آرامگاه بابا طاهر'},
// ] 
// router.get('/dummy', async(req, res)=>{
//     try {
//         const savePromises = branches.map(branchData => {
//             const branch = new Branch({
//                 name: branchData.name,
//                 location: branchData.location
//             });
//             return branch.save(); // Return the Promise
//         });

//         // Wait for all the save operations to complete
//         await Promise.all(savePromises);
//         res.status(201).json({'success':'yes'});
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })


module.exports = router;
