const express = require('express'); 
const cors = require('cors'); 
const db = require('./database'); // Import the database connection

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//////////////////////////////// routes start here //////////////////////////////////////

app.get('/', (req, res) => {
    res.send('Welcome to the TripleTree API!');
});

app.get('/hotels', (req, res) => {
    const query = 'SELECT * FROM Hotel';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching hotels:', err.message);
            res.status(500).send('Error fetching hotels.');
        } else {
            res.json(results);
        }
    });
});

app.get('/rooms/:hotel_id', (req, res) => {
    const { hotel_id } = req.params;
    const query = 'SELECT * FROM Room WHERE hotel_id = ?';
    db.query(query, [hotel_id], (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err.message);
            res.status(500).send('Error fetching rooms.');
        } else {
            res.json(results);
        }
    });
});

app.post('/bookings', (req, res) => {
    const { room_id, check_in_date, check_out_date, total_price, status } = req.body;
    const query = `
        INSERT INTO Booking (room_id, check_in_date, check_out_date, total_price, status)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [room_id, check_in_date, check_out_date, total_price, status], (err, results) => {
        if (err) {
            console.error('Error creating booking:', err.message);
            res.status(500).send('Error creating booking.');
        } else {
            res.json({ bookingId: results.insertId });
        }
    });
});

app.get('/guest/:guest_id', (req, res) => {
    const { guest_id } = req.params;
    const query = 'SELECT * FROM Guest WHERE guest_id = ?';
    db.query(query, [guest_id], (err, results) => {
        if (err) {
            console.error('Error fetching guest details:', err.message);
            res.status(500).send('Error fetching guest details.');
        } else {
            res.json(results);
        }
    });
});

app.get('/services', (req, res) => {
    const query = 'SELECT * FROM Service';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching services:', err.message);
            res.status(500).send('Error fetching services.');
        } else {
            res.json(results);
        }
    });
});

app.get('/bookings/:room_id', (req, res) => {
    const { room_id } = req.params;
    const query = 'SELECT * FROM Booking WHERE room_id = ?';
    db.query(query, [room_id], (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err.message);
            res.status(500).send('Error fetching bookings.');
        } else {
            res.json(results);
        }
    });
});

//////////////////////////////// routes end here //////////////////////////////////////
// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err.message);
        return;
    }
    console.log(`Server running at http://localhost:${PORT}`);
});
