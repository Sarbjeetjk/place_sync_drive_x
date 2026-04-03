import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const email = 'company@example.com';
    let companyUser = await User.findOne({ email });

    if (!companyUser) {
      console.log(`User ${email} not found. You might need to create it first.`);
      process.exit(1);
    }

    const newJobs = [
      {
        companyId: companyUser._id,
        title: "Software Engineer",
        description: "Develop and maintain robust web applications.",
        requiredSkills: ["React", "Node.js", "System Design"],
        isActive: true
      },
      {
        companyId: companyUser._id,
        title: "Frontend Developer",
        description: "Build beautiful and responsive user interfaces.",
        requiredSkills: ["TypeScript", "React", "Redux"],
        isActive: true
      },
      {
        companyId: companyUser._id,
        title: "Full Stack Engineer",
        description: "Work on end-to-end features.",
        requiredSkills: ["AWS", "Java", "React"],
        isActive: true
      },
      {
        companyId: companyUser._id,
        title: "UI Engineer",
        description: "Create pixel-perfect animations and components.",
        requiredSkills: ["React", "CSS Animation", "GraphQL"],
        isActive: true
      }
    ];

    await Job.insertMany(newJobs);
    console.log('Successfully seeded 4 jobs for company@example.com!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seed();
