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
    const usersCount = await User.countDocuments();
    const appsCount = await Application.countDocuments();

    res.json({
      jobs: jobsCount,
      users: usersCount,
      pendingApps: appsCount
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
