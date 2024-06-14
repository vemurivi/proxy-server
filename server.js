const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors({
    origin: '*' // Update this to your client app domain for better security
}));

// Root route for basic testing
app.get('/', (req, res) => {
    res.send('Welcome to the proxy server!');
});

// Route to obtain token
app.post('/auth/token', (req, res) => {
    const options = {
        url: 'https://login.microsoftonline.com/dfb8950c-7b16-4402-8032-4af0c12e59dd/oauth2/v2.0/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            client_id: req.body.client_id,
            client_secret: req.body.client_secret,
            scope: req.body.scope,
            grant_type: req.body.grant_type
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            res.status(500).send({ error: 'Internal Server Error', details: error });
        } else if (response.statusCode !== 200) {
            res.status(response.statusCode).send(body);
        } else {
            res.send(body);
        }
    });
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
