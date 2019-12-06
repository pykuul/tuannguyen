const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

router.use((req, res, next) => {
  if(!req.user || !req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized'});
  }

  next();
})

router.get('/books', async (req, res) => {
  try{
    const books = await Book.list();
    res.status(200).json(books);
  } catch(err) {
    res.status(500).json({ error: err.message || err.toString() });
  }
});

// more routes

module.exports = router;