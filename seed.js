const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ email: 'admin@smartdukan.com' });
        if (adminExists) {
            console.log('Admin already exists');
        } else {
            const admin = new User({
                name: 'Super Admin',
                email: 'admin@smartdukan.com',
                password: 'admin123', // This will be hashed by the User model's pre-save middleware
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
