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
    role: { type: String, enum: ['Admin', 'Mentor', 'SingleMother', 'User'], default: 'SingleMother' },
});

const LogInCollection = mongoose.model('User', UserSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Files Path
const publicPath = path.join(__dirname, '../templates');

// Serve Static Files
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
app.get('/', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(publicPath, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(publicPath, 'register.html')));
app.get('/forgot-password', (req, res) => res.sendFile(path.join(publicPath, 'forgot-password.html')));

// Dashboards

app.get('/admin-dashboard', isRole('Admin'), (req, res) => res.sendFile(path.join(publicPath, 'admin-dashboard.html')));
app.get('/mentor-dashboard', isRole('Mentor'), (req, res) => res.sendFile(path.join(publicPath, 'mentor-dashboard.html')));
app.get('/single-mother-dashboard', isRole('SingleMother'), (req, res) => res.sendFile(path.join(publicPath, 'single-mother-dashboard.html')));

// Registration Route
app.post('/register', async (req, res) => {
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || 'SingleMother', // Default to 'SingleMother' if no role is provided
    };

    try {
        const existingUser = await LogInCollection.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("User already exists. Redirecting to login.");
            return res.status(302).redirect('./login.html'); // 302 status for redirection
        }
        await LogInCollection.create(data);
        res.status(201).redirect('./login.html');
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Error occurred while processing registration");
    }
});
// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login attempt for email:", email); // Log the email being used

        // Check if the user exists
        const user = await LogInCollection.findOne({ email });
        if (!user) {
            console.log("User not found in the database."); // Log if no user is found
            return res.status(404).send("User not found");
        }

        console.log("User found:", user); // Log the retrieved user details

        // Check if the password matches
        if (user.password !== password) {
            console.log("Incorrect password for user:", email); // Log incorrect password
            return res.status(401).send("Incorrect password");
        }

        console.log("Password matched for user:", email); // Log successful password match

        // Redirect to dashboard based on role
        switch (user.role) {
            case 'Admin':
                console.log("Redirecting Admin to admin-dashboard");
                return res.redirect('/admin-dashboard');
            case 'Mentor':
                console.log("Redirecting Mentor to mentor-dashboard");
                return res.redirect('/mentor-dashboard');
            case 'SingleMother':
                console.log("Redirecting SingleMother to single-mother-dashboard");
                return res.redirect('/single-mother-dashboard');
            default:
                console.log("Invalid role for user:", user.role); // Log invalid role
                return res.status(400).send("Invalid user role");
        }
    } catch (error) {
        console.error("Error during login:", error); // Log any unexpected error
        res.status(500).send("Internal Server Error");
    }
});

// Password Reset Route
app.post('/forgot-password', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("No account associated with this email");
        res.send("Password reset instructions sent to your email");
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).send("Error processing password reset");
    }
});

// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

// Export Modules
module.exports = { app, LogInCollection };
