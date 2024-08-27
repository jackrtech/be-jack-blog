const express = require('express');
const { resetDatabase, pool } = require('./db');

const app = express();
app.use(express.json())


app.get('/', async (req, res) => {
    try {
       const results = await pool.query('SELECT * FROM posts');
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
