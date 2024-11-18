const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 
const app = express();
const port = 3000;
const SECRET_KEY = 'secret_key'; 
const mongoose = require("mongoose");
const chartModel = require("./models/chartSchema");
const url = 'mongodb://localhost:27017/r36_data';

mongoose.connect(url)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Error connecting to database", err);
    });

    app.use(cors({
        origin: ['http://localhost', 'http://localhost:4200'],  
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true  
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
        const data = await chartModel.find({});
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
