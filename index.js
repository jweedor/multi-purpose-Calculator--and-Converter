// index.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add Stripe secret key

const app = express();
const PORT = process.env.PORT || 3000; // Use the port from .env or default to 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection (ensure you configure this according to your environment)
const db = mysql.createConnection({
  host: process.env.DB_HOST, // 'localhost'
  user: process.env.DB_USER, // 'root'
  password: process.env.DB_PASSWORD, // Your actual DB password
  database: process.env.DB_NAME, // Your database name
  port: 3306, // MySQL default port
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    process.exit(1);
  }
  console.log("MySQL connected");
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Example POST route for feedback submission (no changes needed here)
app.post("/submit-feedback", (req, res) => {
  const { name, feedback } = req.body;

  console.log("Received feedback:", { name, feedback });

  // Insert feedback into MySQL database
  const query = "INSERT INTO feedbacks (name, feedback) VALUES (?, ?)";
  db.query(query, [name, feedback], (err, results) => {
    if (err) {
      console.error("Error inserting feedback:", err);
      return res.status(500).send("Failed to submit feedback");
    }

    console.log("Feedback inserted with ID:", results.insertId);
    res.status(200).send("Feedback received");
  });
});

// Add the Stripe route to handle donation creation
app.post('/create-checkout-session', async (req, res) => {
    const { name, amount } = req.body; // Capture name and amount from request

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donation',
                    },
                    unit_amount: amount * 100, // Convert dollars to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success.html', // Change this to your success page
        cancel_url: 'http://localhost:3000/donate.html',
    });

    // Insert the donation into your database
    const paymentMethod = session.payment_method_types[0];
    const query = "INSERT INTO donations (name, amount, payment_method) VALUES (?, ?, ?)";
    db.query(query, [name, amount, paymentMethod], (err, results) => {
        if (err) {
            console.error("Error inserting donation:", err);
            return res.status(500).send("Failed to record donation");
        }
        res.json({ id: session.id });
    });
});

// Fallback route: This will serve 'index.html' for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
