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
            
            await pool.query(`
                INSERT INTO posts (title, content, timestamp) VALUES
                ('My First Post', 'This is my first post!', NOW() - INTERVAL '19 seconds'),
                ('My Second Post', 'This is my second post!', NOW() - INTERVAL '18 seconds'),
                ('My Third Post', 'This is my third post!', NOW() - INTERVAL '17 seconds'),
                ('My Fourth Post', 'This is my fourth post!', NOW() - INTERVAL '16 seconds'),
                ('My Fifth Post', 'This is my fifth post!', NOW() - INTERVAL '15 seconds'),
                ('My Sixth Post', 'This is my sixth post!', NOW() - INTERVAL '14 seconds'),
                ('My Seventh Post', 'This is my seventh post!', NOW() - INTERVAL '13 seconds'),
                ('My Eighth Post', 'This is my eighth post!', NOW() - INTERVAL '12 seconds'),
                ('My Ninth Post', 'This is my ninth post!', NOW() - INTERVAL '11 seconds'),
                ('My Tenth Post', 'This is my tenth post!', NOW() - INTERVAL '10 seconds'),
                ('My Eleventh Post', 'This is my eleventh post!', NOW() - INTERVAL '9 seconds'),
                ('My Twelfth Post', 'This is my twelfth post!', NOW() - INTERVAL '8 seconds'),
                ('My Thirteenth Post', 'This is my thirteenth post!', NOW() - INTERVAL '7 seconds'),
                ('My Fourteenth Post', 'This is my fourteenth post!', NOW() - INTERVAL '6 seconds'),
                ('My Fifteenth Post', 'This is my fifteenth post!', NOW() - INTERVAL '5 seconds'),
                ('My Sixteenth Post', 'This is my sixteenth post!', NOW() - INTERVAL '4 seconds'),
                ('My Seventeenth Post', 'This is my seventeenth post!', NOW() - INTERVAL '3 seconds'),
                ('My Eighteenth Post', 'This is my eighteenth post!', NOW() - INTERVAL '2 seconds'),
                ('My Nineteenth Post', 'This is my nineteenth post!', NOW() - INTERVAL '1 second'),
                ('My Twentieth Post', 'This is my twentieth post!', NOW())
            `);
            

        console.log('Database reset successfully');

    }   catch (error) {

        console.log('Error resetting database', error.message);
    }
} 

module.exports = { pool, resetDatabase }