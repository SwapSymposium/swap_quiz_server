const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();
const mongoose = require('mongoose')
const UserModel = require('./models/User')

const path = require("path");



// --------------------------------------------------------------------------------------------------------------

const app = express();
app.use(express.json());
connectDB();

// --------------------------------------------------------------------------------------------------------------

const userRoutes = require('./routes/userRoutes');
const participantsRoutes = require('./routes/participantsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

// --------------------------------------------------------------------------------------------------------------

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// --------------------------------------------------------------------------------------------------------------

app.use('/api/user', userRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/report', reportRoutes);

// --------------------------------------------------------------------------------------------------------------

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --------------------------------------------------------------------------------------------------------------

// const insertMember = async () => {
//     try {
//         await UserModel.create({
//             userId: "SWAP2501",
//             password: "JMC",
//             memberName1: "MOHAMED HANEEF",
//             memberName2: "MOHAMED JAINUL",
//             contactNo: "9087839498",
//             deptName: "COMPUTER APPLICATIONS",
//             clgName: "BISHOP HEBER COLLEGE"
//         });
//         mongoose.connection.close();
//     } catch (err) { console.error(err) }
// }

// insertMember();

// --------------------------------------------------------------------------------------------------------------


//export the images as a static file 


const uploadDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));
