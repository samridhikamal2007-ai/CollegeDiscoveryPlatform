const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { role, page = 1, limit = 10 } = req.query;

        let query = {};

        if (role) {
            query.role = role;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limitNum);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/candidates
// @desc    Get all candidates
// @access Public
router.get('/candidates', async (req, res) => {
    try {
        const { skills, location, page = 1, limit = 10 } = req.query;

        let query = { role: 'candidate', isActive: true };

        if (location) {
            query.location = new RegExp(location, 'i');
        }

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            query.skills = { $in: skillsArray };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;

        const users = await User.find(query)
            .select('name email skills experience education location')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limitNum);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/employers
// @desc    Get all employers
// @access Public
router.get('/employers', async (req, res) => {
    try {
        const { company, page = 1, limit = 10 } = req.query;

        let query = { role: 'employer', isActive: true };

        if (company) {
            query.company = new RegExp(company, 'i');
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;

        const users = await User.find(query)
            .select('name email company companyDescription companyWebsite')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limitNum);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { isActive, isVerified, role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive, isVerified, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        // Also delete user's applications and jobs
        await Application.deleteMany({ applicant: req.params.id });
        await Job.deleteMany({ employer: req.params.id });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/dashboard/stats
// @desc    Get dashboard stats
// @access Private
router.get('/dashboard/stats', protect, async (req, res) => {
    try {
        let stats = {};

        if (req.user.role === 'candidate') {
            // Get stats for candidate
            const applications = await Application.countDocuments({ applicant: req.user._id });
            const savedJobs = req.user.savedJobs.length;
            const pendingApplications = await Application.countDocuments({
                applicant: req.user._id,
                status: 'pending'
            });

            stats = {
                applications,
                savedJobs,
                pendingApplications
            };
        } else if (req.user.role === 'employer') {
            // Get stats for employer
            const jobs = await Job.countDocuments({ employer: req.user._id });
            const activeJobs = await Job.countDocuments({
                employer: req.user._id,
                status: 'open'
            });

            // Get total applicants across all jobs
            const employerJobs = await Job.find({ employer: req.user._id });
            let totalApplicants = 0;
            employerJobs.forEach(job => {
                totalApplicants += job.applicants.length;
            });

            stats = {
                jobs,
                activeJobs,
                totalApplicants
            };
        } else if (req.user.role === 'admin') {
            // Get stats for admin
            const users = await User.countDocuments();
            const candidates = await User.countDocuments({ role: 'candidate' });
            const employers = await User.countDocuments({ role: 'employer' });
            const jobs = await Job.countDocuments();
            const activeJobs = await Job.countDocuments({ status: 'open' });
            const applications = await Application.countDocuments();

            stats = {
                users,
                candidates,
                employers,
                jobs,
                activeJobs,
                applications
            };
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/dashboard/applications
// @desc    Get candidate's job applications
// @access  Private (Candidate only)
router.get('/dashboard/applications', protect, authorize('candidate'), async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: 'job',
                populate: {
                    path: 'employer',
                    select: 'name company companyWebsite'
                }
            })
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
