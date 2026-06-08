import express from 'express';

const server = express();

server.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});