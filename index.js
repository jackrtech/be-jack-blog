const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json())

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.get('/', async (req, res) => {
    try {
      //  const results = await pool.query('SELECT * FROM posts');
        res.json('response');
    } catch (error) {
        console.error(error.message);
        console.log('error message')
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server started on port ${PORT} // http://localhost:${PORT}`));
