const express = require('express');
const router = express.Router();
const postModel = require('../models/post-model');
const fs = require('fs');

// Get list of endpoints
router.get('/endpoints', (req, res) => {
    fs.readFile('endpoints.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ status: 'error', message: 'Could not read file' });
        }
        res.json({ status: 'success', data: JSON.parse(data) });
    });
});

// Get all posts with pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const posts = await postModel.getAllPosts(page, limit);
        res.json({ status: 'success', data: posts });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Get post by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModel.getPostById(id);
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }
        return res.json({ status: 'success', data: post });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ status: 'error', message: 'Title and content are required' });
    }

    try {
        const newPost = await postModel.createPost(title, content);
        res.status(201).json({ status: 'success', data: newPost });
    } catch (error) {
        console.error('Error inserting new blog post:', error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`DELETE request for ID: ${id}`); 
    try {
        const deletedPost = await postModel.deletePostById(id); 
        console.log('CONTROLLER ==> ', deletedPost)
        if (!deletedPost) {
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        } else {
            res.status(200).json({ status: 'success', data: deletedPost });
        }
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});


module.exports = router;
