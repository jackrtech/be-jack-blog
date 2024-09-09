const express = require('express');
const { resetDatabase, pool } = require('./db');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


app.get('/endpoints', (req, res) => {
    fs.readFile('endpoints.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ status: 'error', message: 'Could not read file' });
        }
        res.json({ status: 'success', data: JSON.parse(data) });
    });
});


app.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const results = await pool.query('SELECT * FROM posts ORDER BY timestamp DESC LIMIT $1 OFFSET $2', [limit, offset]);
        const posts = results.rows;
        res.json({ status: 'success', data: posts });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});




app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }

        res.json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

app.post('/', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ status: 'error', message: 'Title and content are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.status(201).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        console.error('Error inserting new blog post:', error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT} // http://localhost:${PORT}`);
    await resetDatabase();
});
