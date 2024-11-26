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
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
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

// Routes
app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// Signup Route
app.post('/register', async (req, res) => {
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    };

    try {
        const existingUser = await LogInCollection.findOne({ email: req.body.email });

        if (existingUser) {
            return res.send("User details already exist");
        }

        await LogInCollection.create(data);
        res.status(201).render("login", { naming: req.body.firstname });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while processing request");
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ email: req.body.email });

        if (!user) {
            return res.send("User not found");
        }

        if (user.password === req.body.password) {
            res.status(201).render("index", { naming: `${user.firstname} ${user.lastname}` });
        } else {
            res.send("Incorrect password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing login");
    }
});


app.post('/forgot-password', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ email: req.body.email });

        if (!user) {
            return res.send("No account associated with this email");
        }

       
        res.send("Password reset instructions sent to your email");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing password reset");
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = { app, LogInCollection };
