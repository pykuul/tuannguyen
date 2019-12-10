const express = require("express");
const Book = require("../models/Book");
const Chapter = require("../models/Chapter");

const router = express.Router();

// get all books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.list();
    return res.status(200).json(books);
  } catch (err) {
    return res.status(400).json({ error: err.message || err.toString() });
  }
});

// get one books details
router.get("/books/:slug", async (req, res) => {
  try {
    const book = await Book.getBySlug({
      slug: req.params.slug,
      userId: req.user && req.user.id
    });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(400).json({ error: err.message || err.toString() });
  }
});

// get one chapter detail /get-chapter-detail?bookSlug=${bookSlug}&chapterSlug=${chapterSlug}
router.get("/get-chapter-detail", async (req, res) => {
  try {
    const { bookSlug, chapterSlug } = req.query;

    const chapter = await Chapter.getBySlug({ bookSlug, chapterSlug });
    // console.log(`chapter at server: ${chapter}`);
    res.status(200).json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message || err.toString() });
  }
});

module.exports = router;
