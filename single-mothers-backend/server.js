const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');
const userroutes = require('./routes/userroutes');
const authroutes = require('./routes/authroutes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connections
const smeefConnection = mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost:27017/smeef', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const mentorDashboardConnection = mongoose.createConnection('mongodb://localhost:27017/mentorDashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schemas
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    mentees: [
        {
            name: String,
            progress: Number, // Progress as percentage
        }
    ],
});

const smeefSchema = new mongoose.Schema({ /* Smeef schema definition here */ });
const mentorSchema = new mongoose.Schema({ /* Mentor schema definition here */ });

// Models
const Contact = smeefConnection.models.Contact || smeefConnection.model('Contact', contactSchema);
const Course = smeefConnection.models.Course || smeefConnection.model('Course', courseSchema);
const SmeefModel = smeefConnection.models.SmeefCollection || smeefConnection.model('SmeefCollection', smeefSchema);
const MentorModel = mentorDashboardConnection.models.MentorCollection || mentorDashboardConnection.model('MentorCollection', mentorSchema);

// Routes
app.use('/users', userroutes); // User management routes
app.use('/auth', authroutes); // Authentication routes

// Serve the Mentor Dashboard HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'mentor-dashboard.html'));
});

// API: Get Mentor Information
app.get('/api/mentor', (req, res) => {
    const mentor = {
        name: 'Keza Joan',
        role: 'Senior Mentor',
        expertise: ['Business Development', 'Leadership'],
        email: 'kezjoana7@gmail.com',
    };
    res.json(mentor);
});

// API: Edit Mentor Profile
app.post('/api/mentor/edit', (req, res) => {
    const updatedMentor = req.body;
    console.log('Updated Mentor Profile:', updatedMentor);
    res.status(200).send({ message: 'Profile updated successfully', updatedMentor });
});

// API: Contact Us
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// About Us Route
app.get('/about-us', (req, res) => {
    const aboutUsData = {
        mission: 'Our mission is to empower single mothers in Rwanda through education, entrepreneurship, and community.',
        vision: 'A future where every single mother can provide for themselves and their children with dignity and support.',
        values: [
            { title: 'Empowerment', description: 'We believe in empowering single mothers to take charge of their futures.' },
            { title: 'Sustainability', description: 'We focus on long-term skills and sustainable solutions for the future.' },
            { title: 'Community', description: 'Together, we can build a network of support for single mothers.' },
        ],
    };
    res.json(aboutUsData);
});

// Logout Route
app.post('/api/logout', (req, res) => {
    res.status(200).send({ message: 'Logged out successfully' });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const users = {
        'mentor@example.com': {
            email: 'mentor@example.com',
            password: 'password123',
            role: 'Senior Mentor',
            expertise: 'Business Development, Leadership'
        }
    };

    const user = users[email];
    if (user && user.password === password) {
        res.status(200).json({ message: 'Login successful!', user: { email: user.email, role: user.role, expertise: user.expertise } });
    } else {
        res.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// API: Get Courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

// API: Add New Course
app.post('/api/courses', async (req, res) => {
    const { title, description, mentees } = req.body;
    const course = new Course({ title, description, mentees });
    try {
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error adding course' });
    }
});

// Handling Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
    console.error(`An error occurred: ${err.message}`);
    process.exit(1);
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
