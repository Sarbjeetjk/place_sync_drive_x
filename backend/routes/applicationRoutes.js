import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/applications/:jobId/apply
// @desc Apply for a job
router.post('/:jobId/apply', protect, authorize('student'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existingApp = await Application.findOne({ jobId: job._id, studentId: req.user.id });
    if (existingApp) return res.status(400).json({ message: 'Already applied' });

    // Auto-calculate initial score based on skills when applying
    const studentProfile = await StudentProfile.findOne({ userId: req.user.id });
    let score = 0;
    
    if (studentProfile) {
      const studentSkills = studentProfile.skills.map(s => s.toLowerCase().trim());
      const jobSkills = job.requiredSkills.map(s => s.toLowerCase().trim());
      
      let matchCount = 0;
      jobSkills.forEach(skill => {
        if (studentSkills.includes(skill)) matchCount++;
      });
      score = jobSkills.length > 0 ? (matchCount / jobSkills.length) * 100 : 0;
    }

    const application = await Application.create({
      jobId: job._id,
      studentId: req.user.id,
      matchScore: score
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/applications/:jobId
// @desc Get applications for a specific job (company)
router.get('/:jobId', protect, authorize('company'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email');
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/applications/:appId/status
// @desc Update application status manually (company)
router.put('/:appId/status', protect, authorize('company'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.appId).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Not found' });
    if (application.jobId.companyId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/applications/student/me
// @desc Get my applications
router.get('/student/me', protect, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
        path: 'jobId',
        select: 'title companyId',
        populate: { path: 'companyId', select: 'name' }
      });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
