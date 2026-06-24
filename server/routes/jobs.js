const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            experience,
            category,
            remote,
            minSalary,
            maxSalary,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        let query = { status: 'open', isActive: true };

        if (search) {
            query.$text = { $search: search };
        }

        if (location) {
            query.location = new RegExp(location, 'i');
        }

        if (jobType) {
            query.jobType = jobType;
        }

        if (experience) {
            query.experience = experience;
        }

        if (category) {
            query.category = category;
        }

        if (remote === 'true') {
            query.remote = true;
        }

        if (minSalary || maxSalary) {
            query['salary.min'] = { $gte: minSalary || 0 };
            query['salary.max'] = { $lte: maxSalary || 999999999 };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;

        // Execute query
        const jobs = await Job.find(query)
            .populate('employer', 'name company companyWebsite')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limitNum);

        const total = await Job.countDocuments(query);

        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/jobs/my-jobs
// @desc    Get employer's jobs
// @access Private (Employer only)
router.get('/my-jobs', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/jobs/saved
// @desc    Get user's saved jobs
// @access Private
router.get('/saved', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedJobs',
            populate: {
                path: 'employer',
                select: 'name company companyWebsite'
            }
        });

        res.status(200).json({
            success: true,
            count: user.savedJobs.length,
            data: user.savedJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            'employer',
            'name company companyDescription companyWebsite'
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Increment views
        job.views += 1;
        await job.save();

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access Private (Employer only)
router.post('/', protect, authorize('employer'), async (req, res) => {
    try {
        req.body.employer = req.user._id;

        const job = await Job.create(req.body);

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access Private (Employer only)
router.put('/:id', protect, authorize('employer'), async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access Private (Employer only)
router.delete('/:id', protect, authorize('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/jobs/:id/save
// @desc    Save/unsave a job
// @access Private
router.post('/:id/save', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const savedIndex = user.savedJobs.indexOf(req.params.id);

        if (savedIndex > -1) {
            // Unsave job
            user.savedJobs.splice(savedIndex, 1);
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Job unsaved',
                saved: false
            });
        } else {
            // Save job
            user.savedJobs.push(req.params.id);
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Job saved',
                saved: true
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access Private (Candidate only)
router.post('/:id/apply', protect, authorize('candidate'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'Job is not accepting applications'
            });
        }

        // Check if already applied
        const alreadyApplied = job.applicants.find(
            (app) => app.user.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Add applicant
        job.applicants.push({
            user: req.user._id,
            resume: req.body.resume,
            coverLetter: req.body.coverLetter
        });

        await job.save();

        // Create application record
        await Application.create({
            job: job._id,
            applicant: req.user._id,
            resume: req.body.resume,
            coverLetter: req.body.coverLetter
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/jobs/:id/applicants
// @desc    Get job applicants
// @access Private (Employer only)
router.get('/:id/applicants', protect, authorize('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            'applicants.user',
            'name email phone skills experience education location'
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view applicants'
            });
        }

        res.status(200).json({
            success: true,
            count: job.applicants.length,
            data: job.applicants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/jobs/:id/applicants/:applicantId
// @desc    Update applicant status
// @access Private (Employer only)
router.put('/:id/applicants/:applicantId', protect, authorize('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update applicants'
            });
        }

        const applicant = job.applicants.find(
            (app) => app.user.toString() === req.params.applicantId
        );

        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: 'Applicant not found'
            });
        }

        applicant.status = req.body.status;
        await job.save();

        // Sync with Application collection
        await Application.findOneAndUpdate(
            { job: job._id, applicant: req.params.applicantId },
            { status: req.body.status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: applicant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
