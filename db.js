const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function resetDatabase() {
    try {

        console.log('testing database connection');

        await pool.query('SELECT NOW()');

        console.log('Connected to database. Current time:', res.rows[0].now);

        console.log('Attempting to reset database...');

        await pool.query('DROP TABLE IF EXISTS posts');

        console.log('table dropped successfully');
        
        await pool.query(`
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`)
        await pool.query (`INSERT INTO posts (title, content) VALUES
            ('My First Post', 'This is my first post!'),
            ('My Second Post', 'This is my second post!')
        `)

        console.log('Database reset successfully');

    }   catch (error) {

        console.log('Error resetting database', error);
    }
} 

module.exports = { pool, resetDatabase }