import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/institute/stats
// @desc Get overview statistics for institute dashboard
router.get('/stats', protect, authorize('institute'), async (req, res) => {
  try {
    const jobsCount = await Job.countDocuments();
    const usersCount = await User.countDocuments({ role: 'student' });
    const companiesCount = await User.countDocuments({ role: 'company' });
    const appsCount = await Application.countDocuments();

    // Aggregate to find top companies by number of jobs
    const topCompaniesAgg = await Job.aggregate([
      { $group: { _id: "$companyId", jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 3 }
    ]);
    
    // populate company names
    const topCompanyUserIds = topCompaniesAgg.map(agg => agg._id);
    const topCompaniesDocs = await User.find({ _id: { $in: topCompanyUserIds } }, 'name');
    
    const topCompanies = topCompaniesAgg.map(agg => {
      const company = topCompaniesDocs.find(c => c._id.toString() === agg._id.toString());
      return {
        name: company ? company.name : 'Unknown',
        count: agg.jobCount
      };
    });

    res.json({
      jobs: jobsCount,
      users: usersCount,
      companies: companiesCount,
      pendingApps: appsCount,
      topCompanies: topCompanies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/institute/users
// @desc Get all users for institute panel
router.get('/users', protect, authorize('institute'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/institute/jobs
// @desc Get all job listings
router.get('/jobs', protect, authorize('institute'), async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/institute/jobs
// @desc Create a job (drive) as institute
router.post('/jobs', protect, authorize('institute'), async (req, res) => {
  try {
    const { companyId, title, description, requiredSkills } = req.body;
    const job = await Job.create({
      companyId,
      title,
      description: description || '',
      requiredSkills: requiredSkills || [],
      isActive: true
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/institute/applications
// @desc Get all applications
router.get('/applications', protect, authorize('institute'), async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('jobId', 'title')
      .populate('studentId', 'name email');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
