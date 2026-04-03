
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const userSchema = new mongoose.Schema({ name: String, email: String, role: String });
const User = mongoose.model('User', userSchema);
mongoose.connect(process.env.MONGO_URI).then(async () => {
    const users = await User.find({ role: 'student' },{name:1, email:1, role:1});
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
});

