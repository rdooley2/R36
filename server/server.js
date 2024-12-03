const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 
const app = express();
const port = 3000;
const SECRET_KEY = 'secret_key'; 
const mongoose = require("mongoose");
const url = 'mongodb://localhost:27017';

const setupDatabase = async () => {
    try {
        const db = mongoose.connection.db;

        console.log("Ensuring 'r36' database and collections are created...");

        // Define data for collections
        const summaryData = [
            { labels: "Jan", value: 20, color: "#8a89a6" },
            { labels: "Feb", value: 22, color: "#7b6888" },
            { labels: "Mar", value: 30, color: "#6b486b" },
            { labels: "Apr", value: 33, color: "#a05d56" },
            { labels: "May", value: 36, color: "#d0743c" },
            { labels: "Jun", value: 36, color: "#ff8c00" },
            { labels: "Jul", value: 37, color: "#b15c75" },
        ];

        const reportsData = [
            { title: "January", value: 4782, color: "#FF6F61" },
            { title: "February", value: 5417, color: "#6FA3EF" },
            { title: "March", value: 7131, color: "#FFD93D" },
            { title: "April", value: 7909, color: "#6BBE45" },
            { title: "May", value: 8592, color: "#FF9A00" },
            { title: "June", value: 8618, color: "#9B59B6" },
            { title: "July", value: 8827, color: "#E74C3C" },
        ];

        // Ensure collections are created and populated
        const summaryCollection = await db.listCollections({ name: "summary" }).toArray();
        if (summaryCollection.length === 0) {
            console.log("Creating and populating 'summary' collection...");
            await db.collection("summary").insertMany(summaryData);
            console.log("'summary' collection created successfully.");
        } else {
            console.log("'summary' collection already exists. Skipping creation.");
        }

        const reportsCollection = await db.listCollections({ name: "reports" }).toArray();
        if (reportsCollection.length === 0) {
            console.log("Creating and populating 'reports' collection...");
            await db.collection("reports").insertMany(reportsData);
            console.log("'reports' collection created successfully.");
        } else {
            console.log("'reports' collection already exists. Skipping creation.");
        }

        console.log("'r36' database setup complete.");
    } catch (error) {
        console.error("Error setting up database and collections:", error);
    }
};

// Connect to MongoDB with the correct database name
mongoose.connect("mongodb://localhost:27017/r36")
    .then(async () => {
        console.log("Connected to MongoDB and using 'r36' database.");
        await setupDatabase();
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use(cors({
    origin: "http://localhost:4200", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies and credentials
}));

app.use(bodyParser.json());

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(403); 

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user; 
        next();
    });
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'ryan' && password === 'ryan') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ success: true, token }); 
    } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
});

app.get('/api/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/getChartData', authenticateJWT, async (req, res) => {
    try {
        const summaryData = await summaryModel.find({});
        const reportsData = await reportsModel.find({});
        res.json({ summary: summaryData, reports: reportsData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
