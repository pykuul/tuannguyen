const mongoose = require("mongoose");
// const Book = require("./Book");
const { Schema } = mongoose;

// define Chapter's properties
const chapterSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: "",
    required: true
  },
  htmlContent: {
    type: String,
    default: "",
    required: true
  },
  excerpt: {
    type: String,
    default: ""
  },
  htmlExcerpt: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    required: true
  },
  githubFilePath: {
    type: String
  },
  order: {
    type: Number,
    required: true
  },
  seoTitle: String,
  seoDescription: String,
  sections: [
    {
      text: String,
      level: Number,
      escapedText: String
    }
  ]
});

// define Chapter's methods
class ChapterClass {
  static async getBySlug({ bookSlug, chapterSlug }) {
    const book = await Book.getBySlug({ slug: bookSlug });

    if (!book) {
      throw new Error("Book not found");
    }

    const chapter = await this.findOne({ bookId: book._id, slug: chapterSlug });

    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const chapterObj = chapter.toObject();
    chapterObj.book = book;

    // console.log(`CHAPTER: ${chapterObj.title}`);
    // console.log(`BOOK: ${chapterObj.book.name}`);

    return chapterObj;
  }
}

// set indexing for Chapter
chapterSchema.index({ bookId: 1, slug: 1 }, { unique: true });
chapterSchema.index({ bookId: 1, githubFilePath: 1 }, { unique: true });

chapterSchema.loadClass(ChapterClass);

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;

const Book = require("./Book");
