const express = require('express');
const cors = require('cors');
const { resetDatabase } = require('./db');
const postController = require('./controllers/post-controller');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/', postController);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT} // http://localhost:${PORT}`);
    await resetDatabase();
});
