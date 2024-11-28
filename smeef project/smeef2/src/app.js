const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb+srv://jkeza1:KGprJacwCqVLAUv8@cluster0.abkhk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'User', 'Mentor', 'SingleMother'], default: 'User' },
});

const LogInCollection = mongoose.model('User', UserSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Paths
const templatePath = path.join(__dirname, '../templates'); 
const publicPath = path.join(__dirname, '../public');

// View Engine Setup
app.set('view engine', 'hbs');
app.set('views', templatePath); 
app.use(express.static(publicPath));

// Middleware to Check Role
const isRole = (role) => async (req, res, next) => {
    try {
        const user = await LogInCollection.findOne({ email: req.query.email || req.body.email });
        if (!user) return res.status(404).send("User not found");
        if (user.role === role) return next();
        return res.status(403).send(`Access Denied: ${role}s Only`);
    } catch (error) {
        console.error("Error verifying role access:", error);
        res.status(500).send("Error verifying role access");
    }
};

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/forgot-password', (req, res) => res.render('forgot-password'));
// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.password !== password) {
            return res.status(401).send("Incorrect password");
        }

        // Redirect based on role
        switch (user.role) {
            case 'Admin':
                return res.redirect('/admin-dashboard');
            case 'Mentor':
                return res.redirect('/mentor-dashboard');
            case 'SingleMother':
                return res.redirect('/single-mother-dashboard');
            default:
                return res.status(400).send("Invalid user role");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Dashboards
app.get('/admin-dashboard', isRole('Admin'), (req, res) => res.render('admin-dashboard'));
app.get('/mentor-dashboard', isRole('Mentor'), (req, res) => res.render('mentor-dashboard'));
app.get('/single-mother-dashboard', isRole('SingleMother'), (req, res) => res.render('single-mother-dashboard'));

// Registration Route
app.post('/register', async (req, res) => {
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || 'User',
    };
    try {
        const existingUser = await LogInCollection.findOne({ email: req.body.email });
        if (existingUser) return res.send("User details already exist");
        await LogInCollection.create(data);
        res.status(201).render("login", { naming: req.body.firstname });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while processing registration");
    }
});

// Login Route
app.post('/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("Please provide email and password");
    }
    try {
        const user = await LogInCollection.findOne({ email: req.body.email });
        if (!user) return res.send("User not found");
        if (user.password !== req.body.password) return res.send("Incorrect password");

        // Redirect to dashboard based on role
        if (user.role === 'Admin') {
            return res.status(201).render("admin-dashboard", { naming: `${user.firstname} ${user.lastname}` });
        } else if (user.role === 'Mentor') {
            return res.status(201).render("mentor-dashboard", { naming: `${user.firstname} ${user.lastname}` });
        } else if (user.role === 'SingleMother') {
            return res.status(201).render("single-mother-dashboard", { naming: `${user.firstname} ${user.lastname}` });
        } else {
            return res.status(201).render("index", { naming: `${user.firstname} ${user.lastname}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing login");
    }
});

// Password Reset Route
app.post('/forgot-password', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ email: req.body.email });
        if (!user) return res.send("No account associated with this email");
        res.send("Password reset instructions sent to your email");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing password reset");
    }
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));

// Export Modules
module.exports = { app, LogInCollection };
