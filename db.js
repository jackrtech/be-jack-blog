const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }}) 

async function resetDatabase() {
    try {

        console.log('testing database connection');

        await pool.query('SELECT NOW()');

        console.log('Connected to database. Current time:');

        console.log('Attempting to reset database...');

        await pool.query('DROP TABLE IF EXISTS posts');

        console.log('table dropped successfully');

        await pool.query(`
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`)
        await pool.query (`INSERT INTO posts (title, content) VALUES
            ('My First Post', 'This is my first post!'),
            ('My Second Post', 'This is my second post!'),
            ('My Third Post', 'This is my third post!'),
            ('My Fourth Post', 'This is my fourth post!'),
            ('My Fifth Post', 'This is my fifth post!'),
            ('My Sixth Post', 'This is my sixth post!'),
            ('My Seventh Post', 'This is my seventh post!'),
            ('My Eighth Post', 'This is my eighth post!'),
            ('My Ninth Post', 'This is my ninth post!'),
            ('My Tenth Post', 'This is my tenth post!'),
            ('My Eleventh Post', 'This is my eleventh post!'),
            ('My Twelfth Post', 'This is my twelfth post!'),
            ('My Thirteenth Post', 'This is my thirteenth post!'),
            ('My Fourteenth Post', 'This is my fourteenth post!'),
            ('My Fifteenth Post', 'This is my fifteenth post!'),
            ('My Sixteenth Post', 'This is my sixteenth post!'),
            ('My Seventeenth Post', 'This is my seventeenth post!'),
            ('My Eighteenth Post', 'This is my eighteenth post!'),
            ('My Nineteenth Post', 'This is my nineteenth post!'),
            ('My Twentieth Post', 'This is my twentieth post!')
        `)

        console.log('Database reset successfully');

    }   catch (error) {

        console.log('Error resetting database', error.message);
    }
} 

module.exports = { pool, resetDatabase }