const express = require('express');
const { resetDatabase, pool } = require('./db');
const fs = require('fs')

const app = express();
app.use(express.json())


app.get('/endpoints', (req, res) => {
    fs.readFile('endpoints.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err.message);
            return;
        }
        res.send(data);
    });
});


app.get('/', async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM posts');
        console.log(results.rows[1])
        res.json('response');
    } catch (error) {
        console.error(error.message);
        console.log('error message')
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT} // http://localhost:${PORT}`)
    await resetDatabase()
});
