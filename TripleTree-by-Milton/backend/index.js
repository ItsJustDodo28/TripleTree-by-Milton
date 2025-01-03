const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import the database connection
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const SEED = parseInt(process.env.SALT_ROUNDS, 10);
const app = express();
const PORT = 5000;

const bcrypt = require('bcrypt');
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
app.post('/api/register', (req, res) => {
    const { firstname, lastname, email, password, address, phone } = req.body;
    console.log(req.body);
    console.log(SEED);
    // Validate input
    if (!password || !email || !firstname || !lastname || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the user into the database
    const emailQuery = `SELECT guest_id FROM guest_email WHERE email = ?`;
    db.query(emailQuery, [email], (emailErr, emailResults) => {
        if (emailErr) {
            console.error('Error checking email:', emailErr.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (emailResults.length > 0) {
            // Email exists, fetch the guest_id
            const guestId = emailResults[0].guest_id;

            // Check if a user is already linked to this guest_id
            const userQuery = `SELECT * FROM users WHERE guest_id = ?`;
            db.query(userQuery, [guestId], async (userErr, userResults) => {
                if (userErr) {
                    console.error('Error checking user:', userErr.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (userResults.length > 0) {
                    // User already exists
                    return res.status(400).json({ error: 'A user is already linked to this email.' });
                } else {
                    // Create a new user linked to the existing guest
                    const hashedPassword = await bcrypt.hash(password, SEED);
                    const newUserQuery = `
                    INSERT INTO users (guest_id, password, loyalty_points, membership_level)
                    VALUES (?, ?, 0, 'Bronze')
                `;
                
                    db.query(newUserQuery, [guestId, hashedPassword], (newUserErr) => {
                        if (newUserErr) {
                            console.error('Error creating user:', newUserErr.message);
                            return res.status(500).json({ error: 'Error creating user' });
                        }
                        const newPhoneQuery = `
                            INSERT INTO guest_phone (guest_id, phone_number)
                            VALUES (?, ?)
                        `;
                        db.query(newPhoneQuery, [guestId, phone], (newPhoneErr) => {
                            if (newPhoneErr) {
                                console.error('Error inserting phone:', newPhoneErr.message);
                                return res.status(500).json({ error: 'Error inserting phone' });
                            }
                            res.json({ success: true, message: 'User registered successfully and linked to existing guest.' });
                        });
                    });

                }
            });
        } else {
            // Email not found, create a new guest
            bcrypt.hash(password, SEED, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('Error hashing password:', hashErr.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Insert into the guest table
                const guestQuery = `
                        INSERT INTO guest (first_name, last_name)
                        VALUES (?, ?)
                    `;
                db.query(guestQuery, [firstname, lastname], (guestErr, guestResult) => {
                    if (guestErr) {
                        console.error('Error inserting guest:', guestErr.message);
                        return res.status(500).json({ error: 'Error inserting guest' });
                    }

                    const guestId = guestResult.insertId;

                    // Insert email into the guest_email table
                    const newEmailQuery = `
                            INSERT INTO guest_email (guest_id, email)
                            VALUES (?, ?)
                        `;
                    db.query(newEmailQuery, [guestId, email], (newEmailErr) => {
                        if (newEmailErr) {
                            console.error('Error inserting email:', newEmailErr.message);
                            return res.status(500).json({ error: 'Error inserting email' });
                        }

                        const newPhoneQuery = `
                            INSERT INTO guest_phone (guest_id, phone_number)
                            VALUES (?, ?)
                        `;
                        db.query(newPhoneQuery, [guestId, phone], (newPhoneErr) => {
                            if (newPhoneErr) {
                                console.error('Error inserting phone:', newPhoneErr.message);
                                return res.status(500).json({ error: 'Error inserting phone' });
                            }
                            // Insert into the users table
                            const newUserQuery = `
                            INSERT INTO users (guest_id, password, loyalty_points, membership_level)
                            VALUES (?, ?, 0, 'Bronze')
                            `;
                        
                            db.query(newUserQuery, [guestId, hashedPassword], (newUserErr) => {
                                if (newUserErr) {
                                    console.error('Error creating user:', newUserErr.message);
                                    return res.status(500).json({ error: 'Error creating user' });
                                }
                                res.json({ success: true, message: 'User and guest created successfully.' });
                            });
                        });
                    });
                });
            });
        }

    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Step 1: Check if the email exists in guest_email
    const emailQuery = `SELECT guest_id FROM guest_email WHERE email = ?`;
    db.query(emailQuery, [email], (emailErr, emailResults) => {
        if (emailErr) {
            console.error('Error checking email:', emailErr.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (emailResults.length === 0) {
            // Email not found
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const guestId = emailResults[0].guest_id;

        // Step 2: Fetch user by guest_id from users table
        const userQuery = `SELECT * FROM users WHERE guest_id = ?`;
        db.query(userQuery, [guestId], async (userErr, userResults) => {
            if (userErr) {
                console.error('Error fetching user:', userErr.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (userResults.length === 0) {
                // No user found for this guest_id
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = userResults[0];
            console.log(user);

            // Step 3: Compare the provided password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Step 4: Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, guestId: guestId, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Step 5: Set cookie with the token
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict',
            });

            // Respond with success and user role
            res.json({ success: true, message: 'Login successful', role: user.role });
        });
    });

});









/*   if (email === 'admin' && password === 'admin') {
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
*/


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

app.get('/api/profile', verifyToken, (req, res) => {
    const userId = req.userId;

    // Query for user data
    const userQuery = `
        SELECT u.user_id, u.guest_id, u.loyalty_points, u.membership_level, 
               g.first_name, g.last_name, 
               GROUP_CONCAT(DISTINCT ge.email ORDER BY ge.email SEPARATOR ', ') AS emails,
               GROUP_CONCAT(DISTINCT gp.phone_number ORDER BY gp.phone_number SEPARATOR ', ') AS phones
        FROM users u
        JOIN guest g ON u.guest_id = g.guest_id
        LEFT JOIN guest_email ge ON g.guest_id = ge.guest_id
        LEFT JOIN guest_phone gp ON g.guest_id = gp.guest_id
        WHERE u.user_id = ?
        GROUP BY u.user_id;
    `;

    const bookingsQuery = `
    SELECT 
        b.booking_id,
        b.status,
        rt.name AS roomType,
        b.check_in_date AS checkIn,
        b.check_out_date AS checkOut,
        b.total_price AS totalCost
    FROM 
        booking b
    JOIN 
        room r ON b.room_id = r.room_id
    JOIN 
        room_type rt ON r.type_id = rt.type_id
    WHERE 
        b.booking_id IN (
            SELECT booking_id
            FROM bookingguest
            WHERE guest_id = (SELECT guest_id FROM users WHERE user_id = ?)
        )
    ORDER BY 
        b.check_in_date DESC;
`;


    // Fetch user data
    db.query(userQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error fetching user profile:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = userResults[0];

        // Fetch booking history
        db.query(bookingsQuery, [userId], (err, bookingResults) => {
            if (err) {
                console.error('Error fetching booking history:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({
                user: userProfile,
                bookings: bookingResults,
            });
        });
    });
});

// Update user profile
app.put('/api/profile', verifyToken, (req, res) => {
    const userId = req.userId;
    const { firstName, lastName, emails, phones } = req.body;

    // Update guest data
    const updateGuestQuery = `
        UPDATE guest
        SET first_name = ?, last_name = ?
        WHERE guest_id = (SELECT guest_id FROM users WHERE user_id = ?);
    `;

    // Update emails
    const deleteEmailsQuery = `DELETE FROM guest_email WHERE guest_id = (SELECT guest_id FROM users WHERE user_id = ?);`;
    const insertEmailQuery = `INSERT INTO guest_email (guest_id, email) VALUES (?, ?);`;

    // Update phones
    const deletePhonesQuery = `DELETE FROM guest_phone WHERE guest_id = (SELECT guest_id FROM users WHERE user_id = ?);`;
    const insertPhoneQuery = `INSERT INTO guest_phone (guest_id, phone_number) VALUES (?, ?);`;

    db.query(updateGuestQuery, [firstName, lastName, userId], (err) => {
        if (err) {
            console.error('Error updating guest profile:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const guestIdQuery = `SELECT guest_id FROM users WHERE user_id = ?`;
        db.query(guestIdQuery, [userId], (err, guestResults) => {
            if (err) {
                console.error('Error fetching guest ID:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const guestId = guestResults[0].guest_id;

            // Update emails
            db.query(deleteEmailsQuery, [userId], (err) => {
                if (err) console.error('Error deleting emails:', err.message);
                if (emails) {
                    const emailList = emails.split(',').map((email) => email.trim());
                    emailList.forEach((email) => {
                        db.query(insertEmailQuery, [guestId, email], (err) => {
                            if (err) console.error('Error adding email:', err.message);
                        });
                    });
                }
            });

            // Update phones
            db.query(deletePhonesQuery, [userId], (err) => {
                if (err) console.error('Error deleting phones:', err.message);
                if (phones) {
                    const phoneList = phones.split(',').map((phone) => phone.trim());
                    phoneList.forEach((phone) => {
                        db.query(insertPhoneQuery, [guestId, phone], (err) => {
                            if (err) console.error('Error adding phone:', err.message);
                        });
                    });
                }
            });

            res.json({ success: true, message: 'Profile updated successfully' });
        });
    });
});

// Delete user account
app.delete('/api/profile', verifyToken, (req, res) => {
    const userId = req.userId;

    const deleteUserQuery = `
        DELETE FROM users WHERE user_id = ?;
    `;

    db.query(deleteUserQuery, [userId], (err) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.clearCookie('authToken');
        res.json({ success: true, message: 'Account deleted successfully' });
    });
});

app.get('/api/booking-details/:id', verifyToken, (req, res) => {
    const bookingId = req.params.id;

    const bookingDetailsQuery = `
        SELECT 
            b.booking_id,
            b.status,
            b.check_in_date AS checkIn,
            b.check_out_date AS checkOut,
            b.total_price AS totalCost,
            rt.name AS roomType,
            rt.description AS roomDescription,
            rt.features AS roomFeatures,
            h.name AS hotelName,
            h.address AS hotelAddress,
            p.status AS paymentStatus,
            s.service_id, s.name AS serviceName, s.price AS servicePrice
        FROM 
            booking b
        JOIN 
            room r ON b.room_id = r.room_id
        JOIN 
            room_type rt ON r.type_id = rt.type_id
        JOIN 
            hotel h ON r.hotel_id = h.hotel_id
        LEFT JOIN 
            payment p ON b.booking_id = p.booking_id
        LEFT JOIN 
            bookingservice bs ON b.booking_id = bs.booking_id
        LEFT JOIN 
            service s ON bs.service_id = s.service_id
        WHERE 
            b.booking_id = ?;
    `;

    db.query(bookingDetailsQuery, [bookingId], (err, results) => {
        if (err) {
            console.error('Error fetching booking details:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = results[0];
        const services = results
            .filter((row) => row.service_id !== null)
            .map((row) => ({
                service_id: row.service_id,
                name: row.serviceName,
                price: row.servicePrice,
            }));

        res.json({
            booking_id: booking.booking_id,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalCost: booking.totalCost,
            roomType: booking.roomType,
            roomDescription: booking.roomDescription,
            roomFeatures: booking.roomFeatures,
            hotelName: booking.hotelName,
            hotelAddress: booking.hotelAddress,
            paymentStatus: booking.paymentStatus,
            services,
            status: booking.status,
        });
    });
});
app.delete('/api/cancel-booking/:id', verifyToken, (req, res) => {
    const bookingId = req.params.id;

    // Check if the booking exists and is eligible for cancellation
    const checkBookingQuery = `
        SELECT 
            booking_id, check_in_date, status
        FROM 
            booking 
        WHERE 
            booking_id = ? AND NOT status = 'Confirmed';
    `;

    db.query(checkBookingQuery, [bookingId], (err, results) => {
        if (err) {
            console.error('Error checking booking:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Check Booking Query Results:', results);
        if (results.length === 0) {
            return res.status(400).json({ error: 'Booking not found or cannot be canceled.' });
        }

        const booking = results[0];
        const checkInDate = new Date(booking.check_in_date);
        const currentDate = new Date();

        // Check if cancellation is allowed (not within 48 hours of check-in)
        const timeDifference = checkInDate.getTime() - currentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference < 48 || booking.status === 'Canceled') {
            return res.status(400).json({ error: 'Cannot cancel bookings within 48 hours of check-in.' });
        }

        // Proceed to cancel the booking
        const cancelBookingQuery = `
            UPDATE booking
            SET status = 'Canceled'
            WHERE booking_id = ?;
        `;

        db.query(cancelBookingQuery, [bookingId], (err) => {
            if (err) {
                console.error('Error canceling booking:', err.message);
                return res.status(500).json({ error: 'Error canceling booking.' });
            }
            console.log('Booking canceled successfully.');
            res.json({ success: true, message: 'Booking canceled successfully.' });
        });
    });
});





app.get('/api/rooms', verifyToken, (req, res) => {
    const { location, hotel, roomType, startDate, endDate } = req.query;

    /*   // SQL Query to fetch available room types
       const query = `
           SELECT DISTINCT r.room_type, r.rates, h.hotel_name, h.location 
           FROM Room r
           JOIN Hotel h ON r.hotel_id = h.hotel_id
           LEFT JOIN Booking b ON r.room_id = b.room_id AND 
               ((b.check_in_date BETWEEN ? AND ?) OR 
                (b.check_out_date BETWEEN ? AND ?) OR 
                (? BETWEEN b.check_in_date AND b.check_out_date))
           WHERE b.booking_id IS NULL
           ${location ? 'AND h.location = ?' : ''}
           ${hotel ? 'AND h.hotel_name = ?' : ''}
           ${roomType ? 'AND r.room_type = ?' : ''}
       `;
   
       const params = [startDate, endDate, startDate, endDate, startDate];
       if (location) params.push(location);
       if (hotel) params.push(hotel);
       if (roomType) params.push(roomType);
   
       db.query(query, params, (err, results) => {
           if (err) {
               console.error('Error fetching rooms:', err.message);
               return res.status(500).json({ error: 'Error fetching rooms.' });
           }
           res.json(results);
       });
   */
    const query = "SELECT * FROM room";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err.message);
            return res.status(500).json({ error: 'Error fetching rooms.' });
        }
        res.json(results);
    });
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
