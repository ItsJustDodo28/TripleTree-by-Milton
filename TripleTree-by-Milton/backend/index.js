const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import the database connection
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(cors({
    credentials: true, // Allow credentials (cookies)
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(cookieParser());

//////////////////////////////////// middleware //////////////////////////////////////

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};



//////////////////////////////////// login //////////////////////////////////////


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    /*
    const query = 'SELECT * FROM Users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.user_id, role: user.role }, SECRET_KEY, {
            expiresIn: '1h',
        });

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
        });

        res.json({ role: user.role });
    });*/
    if (username === 'admin' && password === 'admin') {
        // Generate JWT
        const token = jwt.sign({ userId: 'admin', role: 'admin' }, SECRET_KEY, {
            expiresIn: '1h',
        });

        console.log(token);

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
        });

        res.json({ role: 'admin' });
    } else {
        // Generate JWT
        const token = jwt.sign({ userId: 'user', role: 'user' }, SECRET_KEY, {
            expiresIn: '1h',
        });
        console.log(token);

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
        });

        res.json({ role: 'user' });
    }
});



app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ role: req.role });
});


app.post('/api/logout', (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully' });
});
/*
const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
    });
    navigate('/login');
};
*/



//////////////////////////////// APIs //////////////////////////////////////

// Root API Endpoint
app.get('/api', (req, res) => {
    res.send('Welcome to the TripleTree API!');
});

// Fetch all reservations
app.get('/api/reservations', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const query = 'SELECT * FROM Booking';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching reservations:', err.message);
                res.status(500).json({ error: 'Error fetching reservations.' });
            } else {
                const formattedResults = results.map((item) => ({
                    ...item,
                    check_in_date: item.check_in_date.toISOString().split('T')[0],
                    check_out_date: item.check_out_date.toISOString().split('T')[0],
                }));
                res.json(formattedResults);
            }
        });
    }
});

// Add a new reservation
app.post('/api/reservations', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const { room_id, check_in_date, check_out_date, total_price, status } = req.body;
        const query = `
        INSERT INTO Booking (room_id, check_in_date, check_out_date, total_price, status)
        VALUES (?, ?, ?, ?, ?)
    `;
        db.query(query, [room_id, check_in_date, check_out_date, total_price, status], (err, results) => {
            if (err) {
                console.error('Error adding reservation:', err.message);
                res.status(500).json({ error: 'Error adding reservation.' });
            } else {
                res.json({ success: true, bookingId: results.insertId });
            }
        });
    }
});

// Update an existing reservation
app.put('/api/reservations/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        //const { id } = req.params;
        var { booking_id, room_id, check_in_date, check_out_date, total_price, status } = req.body;
        total_price = parseFloat(total_price);
        const query = `
        UPDATE Booking
        SET room_id = ?, check_in_date = ?, check_out_date = ?, total_price = ?, \`status\` = ?
        WHERE booking_id = ?
    `;
        db.query(query, [room_id, check_in_date, check_out_date, total_price, status, booking_id], (err, results) => {
            if (err) {
                console.error('Error updating reservation:', err.message);
                res.status(500).json({ error: 'Error updating reservation.' });
            } else {
                res.json({ success: true });
            }
        });
    }
});

// Delete a reservation
app.delete('/api/reservations/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const id = req.body['booking_id'];
        const query = 'DELETE FROM Booking WHERE booking_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting reservation:', err.message);
                res.status(500).json({ error: 'Error deleting reservation.' });
                console.log(id);
            } else {
                res.json({ success: true });
                console.log(id);
            }
        });
    }
});


// Fetch all guests
app.get('/api/guests', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const query = `
            SELECT 
                g.guest_id,
                g.first_name,
                g.last_name,
                GROUP_CONCAT(DISTINCT ge.email ORDER BY ge.email SEPARATOR ', ') AS emails,
                GROUP_CONCAT(DISTINCT gp.phone_number ORDER BY gp.phone_number SEPARATOR ', ') AS phones
            FROM 
                guest g
            LEFT JOIN 
                guest_email ge
            ON 
                g.guest_id = ge.guest_id
            LEFT JOIN 
                guest_phone gp
            ON 
                g.guest_id = gp.guest_id
            GROUP BY 
                g.guest_id, g.first_name, g.last_name;
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching guests:', err.message);
                return res.status(500).json({ error: 'Error fetching guests.' });
            }
            res.json(results);
        });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Add a new guest
app.post('/api/guests', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const { guest_id, first_name, last_name, emails, phones } = req.body;

        const guestQuery = `
            INSERT INTO guest (guest_id, first_name, last_name)
            VALUES (?, ?, ?)
        `;

        db.query(guestQuery, [guest_id, first_name, last_name], (err, results) => {
            if (err) {
                console.error('Error adding guest:', err.message);
                return res.status(500).json({ error: 'Error adding guest.' });
            }

            const guestId = guest_id || results.insertId;

            // Insert emails
            const emailList = emails ? emails.split(',').map(email => email.trim()) : [];
            emailList.forEach((email) => {
                const emailQuery = `
                    INSERT INTO guest_email (guest_id, email)
                    VALUES (?, ?)
                `;
                db.query(emailQuery, [guestId, email], (emailErr) => {
                    if (emailErr) console.error('Error adding email:', emailErr.message);
                });
            });

            // Insert phones
            const phoneList = phones ? phones.split(',').map(phone => phone.trim()) : [];
            phoneList.forEach((phone) => {
                const phoneQuery = `
                    INSERT INTO guest_phone (guest_id, phone_number)
                    VALUES (?, ?)
                `;
                db.query(phoneQuery, [guestId, phone], (phoneErr) => {
                    if (phoneErr) console.error('Error adding phone:', phoneErr.message);
                });
            });

            res.json({ success: true, guest_id: guestId });
        });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Update an existing guest
app.put('/api/guests/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        //const { id } = req.params;
        const { guest_id, first_name, last_name, emails, phones } = req.body;

        const updateGuestQuery = `
            UPDATE guest
            SET first_name = ?, last_name = ?
            WHERE guest_id = ?
        `;

        db.query(updateGuestQuery, [first_name, last_name, guest_id], (err) => {
            if (err) {
                console.error('Error updating guest:', err.message);
                return res.status(500).json({ error: 'Error updating guest.' });
            }

            // Update emails
            const emailList = emails ? emails.split(',').map(email => email.trim()) : [];
            const deleteEmailsQuery = `DELETE FROM guest_email WHERE guest_id = ?`;
            db.query(deleteEmailsQuery, [guest_id], (err) => {
                if (err) {
                    console.error('Error updating Email:', err.message);
                    return;
                }
                emailList.forEach((email) => {
                    const emailQuery = `
                        INSERT INTO guest_email (guest_id, email)
                        VALUES (?, ?)
                    `;
                    db.query(emailQuery, [guest_id, email], (emailErr) => {
                        if (emailErr) console.error('Error updating Email:', emailErr.message);
                    });
                });
            });

            // Update phones
            const phoneList = phones ? phones.split(',').map(phone => phone.trim()) : [];
            const deletePhonesQuery = `DELETE FROM guest_phone WHERE guest_id = ?`;
            db.query(deletePhonesQuery, [guest_id], () => {
                phoneList.forEach((phone) => {
                    const phoneQuery = `
                        INSERT INTO guest_phone (guest_id, phone_number)
                        VALUES (?, ?)
                    `;
                    db.query(phoneQuery, [guest_id, phone], (phoneErr) => {
                        if (phoneErr) console.error('Error updating phone:', phoneErr.message);
                    });
                });
            });

            res.json({ success: true });
        });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Delete a guest
app.delete('/api/guests/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        //const { id } = req.params;
        const id = req.body['guest_id'];

        // Delete emails and phones first
        const deleteEmailsQuery = `DELETE FROM guest_email 
        WHERE guest_id = ? AND EXISTS (
          SELECT 1 FROM guest_email WHERE guest_id = ?
        );`;
        const deletePhonesQuery = `DELETE FROM guest_phone 
        WHERE guest_id = ? AND EXISTS (
        SELECT 1 FROM guest_phone WHERE guest_id = ?
        );`;

        db.query(deleteEmailsQuery, [id], (emailErr) => {
            if (emailErr) console.error('Error deleting emails:', emailErr.message);
        });

        db.query(deletePhonesQuery, [id], (phoneErr) => {
            if (phoneErr) console.error('Error deleting phones:', phoneErr.message);
        });

        // Delete guest
        const deleteGuestQuery = `DELETE FROM guest WHERE guest_id = ?`;
        db.query(deleteGuestQuery, [id], (err) => {
            if (err) {
                console.error('Error deleting guest:', err.message);
                return res.status(500).json({ error: 'Error deleting guest.' });
            }
            res.json({ success: true });
        });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});






// Fetch all employees
app.get('/api/employees', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const query = 'SELECT * FROM Employee';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching employees:', err.message);
                res.status(500).json({ error: 'Error fetching employees.' });
            } else {
                res.json(results);
            }
        });
    }
});

// Add a new employee
app.post('/api/employees', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const { employee_id, hotel_id, first_name, last_name, position, salary, supervisor } = req.body;
        const query = `
        INSERT INTO Employee (employee_id, hotel_id, first_name, last_name, position, salary, supervisor)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        db.query(query, [employee_id, hotel_id, first_name, last_name, position, salary, supervisor], (err, results) => {
            if (err) {
                console.error('Error adding employee:', err.message);
                res.status(500).json({ error: 'Error adding employee.' });
            } else {
                res.json({ success: true, employee_id: results.insertId });
            }
        });
    }
});

// Update an existing employee
app.put('/api/employees/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        //const { id } = req.params;
        var { employee_id, hotel_id, first_name, last_name, position, salary, supervisor } = req.body;
        const query = `
        UPDATE Employee
        SET hotel_id = ?, first_name = ?, last_name = ?, position = ?, salary = ?, supervisor = ?
        WHERE employee_id = ?
    `;
        db.query(query, [hotel_id, first_name, last_name, position, salary, supervisor, employee_id], (err, results) => {
            if (err) {
                console.error('Error updating employee:', err.message);
                res.status(500).json({ error: 'Error updating employee.' });
            } else {
                res.json({ success: true });
            }
        });
    }
});

// Delete a employee
app.delete('/api/employees/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const id = req.body['employee_id'];
        const query = 'DELETE FROM Employee WHERE employee_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting employee:', err.message);
                res.status(500).json({ error: 'Error deleting employee.' });
                console.log(id);
            } else {
                res.json({ success: true });
                console.log(id);
            }
        });
    }
});






// Fetch all rooms
app.get('/api/rooms', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const query = 'SELECT * FROM Room';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching rooms:', err.message);
                res.status(500).json({ error: 'Error fetching rooms.' });
            } else {
                res.json(results);
            }
        });
    }
});

// Add a new room
app.post('/api/rooms', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const { room_id, hotel_id, room_type, rates, status } = req.body;
        const query = `
        INSERT INTO Room (room_id, hotel_id, room_type, rates, status)
        VALUES (?, ?, ?, ?, ?)
    `;
        db.query(query, [room_id, hotel_id, room_type, rates, status], (err, results) => {
            if (err) {
                console.error('Error adding room:', err.message);
                res.status(500).json({ error: 'Error adding room.' });
            } else {
                res.json({ success: true, room_id: results.insertId });
            }
        });
    }
});

// Update an existing room
app.put('/api/rooms/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        //const { id } = req.params;
        var { room_id, hotel_id, room_type, rates, status } = req.body;
        const query = `
        UPDATE Room
        SET hotel_id = ?, room_type = ?, rates = ?, status = ?
        WHERE room_id = ?
    `;
        db.query(query, [hotel_id, room_type, rates, status, room_id], (err, results) => {
            if (err) {
                console.error('Error updating room:', err.message);
                res.status(500).json({ error: 'Error updating room.' });
            } else {
                res.json({ success: true });
            }
        });
    }
});

// Delete a room
app.delete('/api/rooms/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const id = req.body['room_id'];
        const query = 'DELETE FROM Room WHERE room_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting room:', err.message);
                res.status(500).json({ error: 'Error deleting room.' });
                console.log(id);
            } else {
                res.json({ success: true });
                console.log(id);
            }
        });
    }
});





// Fetch all services
app.get('/api/services', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const query = 'SELECT * FROM Service';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching services:', err.message);
                res.status(500).json({ error: 'Error fetching services.' });
            } else {
                res.json(results);
            }
        });
    }
});


// Add a new service
app.post('/api/services', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const { service_id, name, description, price } = req.body;
        const query = `
        INSERT INTO service (service_id, name, description, price)
        VALUES (?, ?, ?, ?)
    `;
        db.query(query, [service_id, name, description, price], (err, results) => {
            if (err) {
                console.error('Error adding service:', err.message);
                res.status(500).json({ error: 'Error adding service.' });
            } else {
                res.json({ success: true, service_id: results.insertId });
            }
        });
    }
});

// Update an existing service
app.put('/api/services/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        //const { id } = req.params;
        var { service_id, name, description, price } = req.body;
        const query = `
        UPDATE service
        SET name = ?, description = ?, price = ?
        WHERE service_id = ?
    `;
        db.query(query, [name, description, service_id, service_id], (err, results) => {
            if (err) {
                console.error('Error updating service:', err.message);
                res.status(500).json({ error: 'Error updating service.' });
            } else {
                res.json({ success: true });
            }
        });
    }
});

// Delete a service
app.delete('/api/services/:id', verifyToken, (req, res) => {
    if (req.role === 'admin') {
        const id = req.body['service_id'];
        const query = 'DELETE FROM service WHERE service_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting service:', err.message);
                res.status(500).json({ error: 'Error deleting service.' });
                console.log(id);
            } else {
                res.json({ success: true });
                console.log(id);
            }
        });
    }
});







// Analytics: Reservations Over Time
app.get("/api/analytics/reservations", (req, res) => {
    const query = `
      SELECT DATE(check_in_date) AS date, COUNT(*) AS count 
      FROM Booking 
      GROUP BY DATE(check_in_date)
      ORDER BY date
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching reservation stats:", err.message);
            res.status(500).send("Error fetching reservation stats.");
        } else {
            res.json(results);
        }
    });
});

// Analytics: Room Occupancy
app.get("/api/analytics/occupancy", (req, res) => {
    const query = `
      SELECT Room.room_type AS type, COUNT(Booking.room_id) AS occupancy
      FROM Room
      LEFT JOIN Booking ON Room.room_id = Booking.room_id
      GROUP BY Room.room_type
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching room occupancy:", err.message);
            res.status(500).send("Error fetching room occupancy.");
        } else {
            res.json(results);
        }
    });
});

// Serve React App
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
