const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const saltRounds = 10;

const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

connection.connect();

app.post('/clipboard', (req, res) => {
    const content = req.body.content;
    const password = req.body.password;
    const expiresAt = req.body.expires_at;

    bcrypt.hash(password, saltRounds, (error, passwordHash) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create password hash' });
            return;
        }

        const query = 'INSERT INTO clipboard_items (content, password_hash, expires_at) VALUES (?, ?, ?)';
        const values = [content, passwordHash, expiresAt];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to save clipboard item' });
                return;
            }

            const id = results.insertId;
            res.json({ id });
        });
    });
});

app.get('/clipboard/:id', (req, res) => {
    const id = req.params.id;
    const password = req.query.password;

    const query = 'SELECT * FROM clipboard_items WHERE id = ?';
    const values = [id];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to load clipboard item' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Clipboard item not found' });
            return;
        }

        const item = results[0];

        if (item.expires_at && item.expires_at < new Date()) {
            res.status(404).json({ message: 'Clipboard item has expired' });
            return;
        }

        if (item.password_hash) {
            bcrypt.compare(password, item.password_hash, (error, match) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Failed to compare password hash' });
                    return;
                }

                if (!match) {
                    res.status(401).json({ message: 'Invalid password' });
                    return;
                }

                res.json({ content: item.content });
            });
        } else {
            res.json({ content: item.content });
        }
    });
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});
