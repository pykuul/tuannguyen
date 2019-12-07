const mongoose = require("mongoose");
const { Schema } = mongoose;
const Chapter = require("./Chapter");
const { generateSlug } = require("../utils/slugify");

const bookSchema = new Schema({
  // Book props
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  githubRepo: {
    type: String,
    required: true
  },
  githubLastCommitSha: String
});

class BookClass {
  // Book methods
  // get a list of books in the database
  static async list({ offset = 0, limit = 10 } = {}) {
    const books = await this.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return { books };
  }

  // find one book by its slug
  static async getBySlug({ slug }) {
    const bookDoc = await this.findOne({ slug });

    if (!bookDoc) throw new Error("Book not found");

    const book = bookDoc.toObject();

    // get the books chapters
    book.chapters = (
      await Chapter.find({ bookId: book._id }, "title slug").sort({ order: 1 })
    ).map(chapter => chapter.toOject());

    return book;
  }

  // add a new book
  static async add({ name, price, githubRepo }) {
    const slug = await generateSlug(this, name);

    if (!slug) throw new Error(`Error with slug generation for name: ${name}`);

    return this.create({
      name,
      slug,
      price,
      githubRepo,
      createdAt: new Date()
    });
  }

  // find and edit a book
  static async edit({ id, name, price, githubRepo }) {
    const book = await this.findById(id, "slug name");

    if (!book) {
      throw new Error("Book is not found by id");
    }

    const modifier = { price, githubRepo };

    if (name !== book.name) {
      modifier.name = name;
      modifier.slug = await generateSlug(this, name);
    }

    await this.updateOne({ _id: id }, { $set: modifier });

    const editedBook = await this.findById(id, "slug");

    // or can use findOneAndUpdate methods instead of 2 code lines above
    // const editedBook = await this.findOneAndUpdate(
    //   { _id: id },
    //   { $set: modifier },
    //   { fields: "slug", new: true }
    // );

    return editedBook;
  }
}

bookSchema.loadClass(BookClass);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
