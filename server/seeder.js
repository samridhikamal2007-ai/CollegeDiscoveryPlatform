const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');

const connectDB = require('./config/db');

// Sample employer user
const sampleEmployer = {
    name: 'TechCorp HR',
    email: 'hr@techcorp.com',
    password: '123456',
    role: 'employer',
    company: 'TechCorp Inc',
    companyDescription: 'Leading tech company building innovative solutions',
    companyWebsite: 'https://techcorp.com',
    isVerified: true,
    isActive: true
};

// Sample jobs data
const sampleJobs = [
    {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc',
        companyLogo: '',
        description: 'Build scalable web applications using React, Node.js, and MongoDB. Lead development team.',
        requirements: ['React 3+ years', 'Node.js/Express', 'MongoDB', 'AWS'],
        responsibilities: ['Lead frontend development', 'Build REST APIs', 'Database design'],
        location: 'San Francisco, CA (Remote OK)',
        remote: true,
        jobType: 'full-time',
        experience: 'senior',
        salary: { min: 140000, max: 180000, currency: 'USD' },
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
        category: 'engineering',
        employer: null, // will be set after creating employer
        status: 'open'
    },
    {
        title: 'Frontend Engineer (React)',
        company: 'DesignHub',
        description: 'Create beautiful, responsive UIs using modern React patterns.',
        location: 'New York, NY',
        remote: true,
        jobType: 'full-time',
        experience: 'mid',
        salary: { min: 90000, max: 120000 },
        skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
        category: 'engineering'
    },
    {
        title: 'UX/UI Designer',
        company: 'DesignHub',
        description: 'Design intuitive user interfaces and experiences.',
        location: 'Remote',
        remote: true,
        jobType: 'full-time',
        experience: 'mid',
        salary: { min: 85000, max: 110000 },
        skills: ['Figma', 'Adobe XD', 'User Research'],
        category: 'design'
    },
    {
        title: 'Marketing Manager',
        company: 'GrowthCo',
        description: 'Develop and execute marketing strategies.',
        location: 'Chicago, IL',
        jobType: 'full-time',
        experience: 'senior',
        salary: { min: 95000, max: 130000 },
        skills: ['Digital Marketing', 'SEO', 'Content'],
        category: 'marketing'
    },
    {
        title: 'Data Analyst',
        company: 'DataWorks',
        description: 'Analyze business data and create insights.',
        location: 'Remote',
        jobType: 'full-time',
        experience: 'mid',
        salary: { min: 75000, max: 100000 },
        skills: ['SQL', 'Python', 'Tableau', 'Excel'],
        category: 'engineering'
    },
    {
        title: 'Sales Executive',
        company: 'SalesForcePro',
        description: 'Drive revenue through B2B sales.',
        location: 'Denver, CO',
        jobType: 'full-time',
        experience: 'entry',
        salary: { min: 60000, max: 90000 },
        skills: ['Sales', 'CRM', 'Negotiation'],
        category: 'sales'
    },
    {
        title: 'Product Manager',
        company: 'StartUpX',
        description: 'Drive product strategy and coordinate cross-functional teams.',
        location: 'Remote (US)',
        jobType: 'full-time',
        experience: 'senior',
        salary: { min: 120000, max: 160000 },
        skills: ['Product Management', 'Agile', 'Analytics'],
        category: 'other'
    },
    {
        title: 'DevOps Engineer',
        company: 'CloudScale',
        description: 'Build and maintain CI/CD pipelines and cloud infrastructure.',
        location: 'Austin, TX',
        jobType: 'full-time',
        experience: 'mid',
        salary: { min: 110000, max: 150000 },
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        category: 'engineering'
    }
];


const importData = async () => {
    try {
        await connectDB();

        // Delete existing data
        await Job.deleteMany();
        await User.deleteMany();

        console.log('Data deleted...');

        // Create employer
        const employer = await User.create(sampleEmployer);
        console.log(`Created employer: ${employer.name}`);

        // Add employer ID to jobs
        const jobsWithEmployer = sampleJobs.map(job => ({
            ...job,
            employer: employer._id
        }));

        // Insert jobs
        await Job.insertMany(jobsWithEmployer);
        console.log(`Seeded ${jobsWithEmployer.length} jobs`);

        console.log('✅ Seeder completed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeder error:', error);
        process.exit(1);
    }
};

module.exports = importData;


// Run seeder
if (process.argv[2] === '-i') {
    importData();
} else {
    console.log('Usage: node seeder.js -i');
}
