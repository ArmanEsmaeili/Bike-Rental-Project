require('dotenv').config(); // خواندن متغیرهای محیطی از .env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// اتصال به دیتابیس از طریق فایل config/db.js
require('./config/db');

const app = express();

// استفاده از Middleware ها
app.use(cors()); // فعال کردن CORS برای ارتباط فرانت‌اند با بک‌اند
app.use(express.json()); // پردازش درخواست‌های JSON
app.use(express.static('frontend'));

// مسیرهای API
app.use('/user', require('./routes/user'));         // user actions : get, update, delete
app.use('/auth', require('./routes/auth'));         // مسیرهای ثبت‌نام و ورود کاربران
app.use('/bikes', require('./routes/bikes'));       // مسیرهای مدیریت و نمایش دوچرخه‌ها
app.use('/branches', require('./routes/branches')); // مسیرهای شعبه‌ها
app.use('/rental', require('./routes/rental'));     // مسیرهای اجاره دوچرخه

// پورت سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));