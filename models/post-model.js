const { pool } = require('../db');

const getAllPosts = async (page, limit) => {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const results = await pool.query('SELECT * FROM posts ORDER BY timestamp DESC LIMIT $1 OFFSET $2', [parsedLimit, offset]);
    return results.rows;
};

const getPostById = async (id) => {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
};

const createPost = async (title, content) => {
    const result = await pool.query('INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
    return result.rows[0];
};

module.exports = { getAllPosts, getPostById, createPost };
