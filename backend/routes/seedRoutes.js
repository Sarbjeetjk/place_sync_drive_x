import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';

const router = express.Router();

// @route POST /api/seed
// @desc Seed users (Student, Company, Institute)
router.post('/', async (req, res) => {
  try {
    await User.deleteMany();
    await StudentProfile.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Demo Student',
        email: 'student@example.com',
        password,
        role: 'student'
      },
      {
        name: 'Demo Company',
        email: 'company@example.com',
        password,
        role: 'company'
      },
      {
        name: 'Demo Institute',
        email: 'institute@example.com',
        password,
        role: 'institute'
      }
    ];

    const createdUsers = await User.insertMany(users);

    const studentUser = createdUsers.find(u => u.role === 'student');

    if (studentUser) {
      await StudentProfile.create({
        userId: studentUser._id,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        bio: 'Enthusiastic full-stack developer',
        education: 'B.Tech Computer Science'
      });
    }

    res.status(201).json({ message: 'Database seeded with demo users! Everything reset.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
