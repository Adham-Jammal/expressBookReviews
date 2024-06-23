const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Token not provided');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        console.log('Token verified, user:', user);
        next();
    });
});

const PORT = 8000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
