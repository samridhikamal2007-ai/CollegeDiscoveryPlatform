const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide job title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true,
        maxlength: [100, 'Company cannot be more than 100 characters']
    },
    companyLogo: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: [true, 'Please provide job description']
    },
    requirements: [{
        type: String
    }],
    responsibilities: [{
        type: String
    }],
    location: {
        type: String,
        required: [true, 'Please provide job location']
    },
    remote: {
        type: Boolean,
        default: false
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
        default: 'full-time'
    },
    experience: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
        default: 'mid'
    },
    salary: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    skills: [{
        type: String
    }],
    category: {
        type: String,
        required: [true, 'Please provide job category'],
        enum: [
            'engineering',
            'design',
            'marketing',
            'sales',
            'customer-service',
            'hr',
            'finance',
            'healthcare',
            'education',
            'other'
        ]
    },
    applicationDeadline: {
        type: Date
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
            default: 'pending'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        resume: {
            type: String
        },
        coverLetter: {
            type: String
        }
    }],
    status: {
        type: String,
        enum: ['open', 'closed', 'draft'],
        default: 'open'
    },
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
JobSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for search
JobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', JobSchema);
