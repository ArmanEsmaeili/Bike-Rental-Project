const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            'username': user.username, 
            'name': user.name, 
            'email':user.email
        });
       } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;