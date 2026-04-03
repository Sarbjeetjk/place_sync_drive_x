import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/jobs
// @desc Get all active jobs (for students) or company-specific jobs 
router.get('/', protect, async (req, res) => {
  try {
    let jobs;
    if (req.user.role === 'company') {
      jobs = await Job.find({ companyId: req.user.id }).populate('companyId', 'name email');
    } else {
      jobs = await Job.find({ isActive: true }).populate('companyId', 'name email');
    }
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/jobs
// @desc Create a job
router.post('/', protect, authorize('company'), async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;
    const job = await Job.create({
      companyId: req.user.id,
      title,
      description,
      requiredSkills
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/jobs/:id/auto-shortlist
// @desc Trigger AI shortlisting for a job
router.post('/:id/auto-shortlist', protect, authorize('company'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const applications = await Application.find({ jobId: job._id, status: 'applied' });
    
    let shortlistedCount = 0;

    for (const app of applications) {
      const studentProfile = await StudentProfile.findOne({ userId: app.studentId });
      if (!studentProfile) continue;

      // Ensure lowercase for case-insensitive matching
      const studentSkills = studentProfile.skills.map(s => s.toLowerCase().trim());
      const jobSkills = job.requiredSkills.map(s => s.toLowerCase().trim());

      let matchCount = 0;
      jobSkills.forEach(skill => {
        if (studentSkills.includes(skill)) matchCount++;
      });

      const score = jobSkills.length > 0 ? (matchCount / jobSkills.length) * 100 : 0;
      app.matchScore = score;
      
      if (score >= 80) {
        app.status = 'shortlisted';
        shortlistedCount++;
      }
      await app.save();
    }

    res.json({ message: `Auto-shortlisting complete. Shortlisted ${shortlistedCount} candidates.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
