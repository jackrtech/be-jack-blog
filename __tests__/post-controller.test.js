// tests/post-routes.test.js
const request = require('supertest');
const express = require('express');
const postRouter = require('../controllers/post-controller');
const { pool } = require('../db');

// Create an instance of the express app
const app = express();
app.use(express.json());
app.use('/posts', postRouter);

// Set up and tear down
beforeAll(async () => {
    await pool.query('CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, title VARCHAR(255), content TEXT, timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)');
});

afterAll(async () => {
    await pool.query('DROP TABLE IF EXISTS posts');
    await pool.end();
});

describe('Post Routes', () => {


    test('GET /posts should return a list of posts', async () => {
        await request(app)
            .post('/posts')
            .send({ title: 'First Post', content: 'Content of the first post' });
        
        const response = await request(app).get('/posts');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toBeInstanceOf(Array);
    });


    test('GET /posts/:id should return a post by ID', async () => {
        const newPostResponse = await request(app)
            .post('/posts')
            .send({ title: 'Post for ID Test', content: 'Content for post ID test' });
        const postId = newPostResponse.body.data.id;

        const response = await request(app).get(`/posts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('id', postId);
    });


    test('POST /posts should create a new post', async () => {
        const response = await request(app)
            .post('/posts')
            .send({ title: 'New Test Post', content: 'Content for new test post' });
        
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('title', 'New Test Post');
    });

    
    test('DELETE /posts/:id should delete a post by ID', async () => {
        const newPostResponse = await request(app)
            .post('/posts')
            .send({ title: 'Post to Delete', content: 'Content for post to delete' });
        const postId = newPostResponse.body.data.id;

        const deleteResponse = await request(app).delete(`/posts/${postId}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.status).toBe('success');
        expect(deleteResponse.body.data).toHaveProperty('id', postId);

       
        const getResponse = await request(app).get(`/posts/${postId}`);
        expect(getResponse.status).toBe(404);
    });

   
    test('GET /posts/endpoints should return the list of endpoints', async () => {
        const response = await request(app).get('/posts/endpoints');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('endpoints');
    });

});
