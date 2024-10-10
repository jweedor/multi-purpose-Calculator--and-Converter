// index.js
const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Use 3000 for the Express server

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // 'localhost'
    user: process.env.DB_USER,        // 'root'
    password: process.env.DB_PASSWORD, // Your actual DB password
    database: process.env.DB_NAME,     // Your database name
    port: 3306                          // MySQL's default port
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected');
});

// Send Email Function (currently commented out for testing)
// async function sendFeedbackEmail(name, feedback) {
//     let transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_USER, // Your email
//             pass: process.env.EMAIL_PASS, // Your email password
//         }
//     });

//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: 'weedor02@gmail.com', // Your developer email
//         subject: `New Feedback from ${name}`,
//         text: `Name: ${name}\nFeedback: ${feedback}`
//     };

//     await transporter.sendMail(mailOptions);
// }

// Route to handle feedback submission
app.post('/submit-feedback', (req, res) => {
    const { name, feedback } = req.body;

    console.log('Received feedback:', { name, feedback }); // Log received data

    // Insert feedback into the database
    const query = 'INSERT INTO feedbacks (name, feedback) VALUES (?, ?)';
    db.query(query, [name, feedback], (err, results) => {
        if (err) {
            console.error('Error inserting feedback:', err); // Log any error
            return res.status(500).send('Failed to submit feedback');
        }

        console.log('Feedback inserted with ID:', results.insertId); // Log successful insertion
        res.status(200).send('Feedback received');

        // Uncomment this to send feedback via email
        // await sendFeedbackEmail(name, feedback);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Use PORT variable here
});
