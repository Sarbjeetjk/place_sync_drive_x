import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

const router = express.Router();

// @route POST /api/seed
// @desc Seed users (Student, Company, Institute)
router.post('/', async (req, res) => {
  try {
    await User.deleteMany();
    await StudentProfile.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      { name: 'Alice Frontend', email: 'alice@example.com', password, role: 'student' },
      { name: 'Bob Backend', email: 'bob@example.com', password, role: 'student' },
      { name: 'Charlie Fullstack', email: 'charlie@example.com', password, role: 'student' },
      { name: 'David Data', email: 'david@example.com', password, role: 'student' },
      { name: 'Eve Mobile', email: 'eve@example.com', password, role: 'student' },
      { name: 'Demo Company', email: 'company@example.com', password, role: 'company' },
      { name: 'Demo Institute', email: 'institute@example.com', password, role: 'institute' }
    ];

    const createdUsers = await User.insertMany(users);
    
    const company = createdUsers.find(u => u.role === 'company');
    const students = createdUsers.filter(u => u.role === 'student');

    // Create student profiles
    const profiles = [
      { userId: students[0]._id, skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind CSS'], bio: 'Loves building UI', education: 'B.Sc CS' },
      { userId: students[1]._id, skills: ['Node.js', 'Express', 'MongoDB', 'Python'], bio: 'Backend scaling architecture', education: 'M.Tech IT' },
      { userId: students[2]._id, skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'], bio: 'Fullstack wizard', education: 'B.E CS' },
      { userId: students[3]._id, skills: ['Python', 'SQL', 'Pandas', 'Machine Learning'], bio: 'Data cruncher', education: 'B.Sc Data Science' },
      { userId: students[4]._id, skills: ['Swift', 'Kotlin', 'React Native', 'JavaScript'], bio: 'Mobile apps expert', education: 'B.Tech IT' },
    ];
    await StudentProfile.insertMany(profiles);

    // Create a demo job
    const job = await Job.create({
      companyId: company._id,
      title: 'Full Stack Engineer',
      description: 'We are looking for a full stack engineer proficient in MERN stack.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript']
    });

    // Create applications and calculate match score
    const required = job.requiredSkills.map(s => s.toLowerCase());
    
    for (const profile of profiles) {
      const studentSkills = profile.skills.map(s => s.toLowerCase());
      let matchCount = 0;
      required.forEach(skill => {
        if (studentSkills.includes(skill)) matchCount++;
      });
      const score = required.length > 0 ? (matchCount / required.length) * 100 : 0;
      
      await Application.create({
        jobId: job._id,
        studentId: profile.userId,
        matchScore: score,
        status: score >= 80 ? 'shortlisted' : 'applied'
      });
    }

    res.status(201).json({ message: 'Database seeded with extensive demo data! Everything reset.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
