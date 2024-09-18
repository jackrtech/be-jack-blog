// tests/post-model.test.js
const { pool } = require('../db');
const postModel = require('../models/post-model');

beforeAll(async () => {
    await pool.query('CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, title VARCHAR(255), content TEXT, timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)');
});

afterAll(async () => {
    await pool.query('DROP TABLE IF EXISTS posts');
    await pool.end();
});

describe('Post Model', () => {

    // Test createPost
    test('should create a new post', async () => {
        const title = 'Test Post';
        const content = 'This is a test post content';
        const newPost = await postModel.createPost(title, content);

        expect(newPost).toHaveProperty('id');
        expect(newPost.title).toBe(title);
        expect(newPost.content).toBe(content);
    });

    test('should retrieve all posts', async () => {
        // Check if there is at least one post
        await postModel.createPost('Another Test Post', 'Content for another post');

        const posts = await postModel.getAllPosts(1, 10);
        expect(posts).toBeInstanceOf(Array);
        expect(posts.length).toBeGreaterThan(0);
    });

    // Test getPostById
    test('should retrieve a post by ID', async () => {
        const newPost = await postModel.createPost('Test Post By ID', 'Content for post by ID');
        const post = await postModel.getPostById(newPost.id);

        expect(post).toHaveProperty('id', newPost.id);
        expect(post.title).toBe(newPost.title);
        expect(post.content).toBe(newPost.content);
    });

    // Test deletePostById
    test('should delete a post by ID', async () => {
        const newPost = await postModel.createPost('Post to Delete', 'Content for post to delete');
        const deletedPost = await postModel.deletePostById(newPost.id);

        expect(deletedPost).toHaveProperty('id', newPost.id);
        expect(deletedPost.title).toBe(newPost.title);

        const postAfterDelete = await postModel.getPostById(newPost.id);
        expect(postAfterDelete).toBeUndefined();
    });

});
