// default list all the books we have in the database
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
// import MUI
import Button from "@material-ui/core/Button";
// import components
import notify from "../../lib/notifier";
import withAuth from "../../lib/withAuth";
import { getBookList } from "../../lib/api/admin";
import sendRequest from "../../lib/sendRequest";

const Index = ({ books }) => (
  <div style={{ padding: "10px 45px" }}>
    <div>
      <h2>Books</h2>
      <Link href="/admin/add-book">
        <Button variant="contained">Add book</Button>
      </Link>
      <p />
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <Link
              href={`/admin/book-detail?slug=${book.slug}`}
              as={`/admin/book-detail/${book.slug}`}
            >
              <a>{book.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <br />
    </div>
  </div>
);

Index.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    })
  ).isRequired
};

const IndexWithData = () => {
  // define component's state
  const [books, setBooks] = useState({ books: [] });

  // componentDidMount
  useEffect(() => {
    const BASE_PATH = "/api/v1/admin";
    // fetch the list of all books
    (async function fetchAllBooks() {
      try {
        const { books } = await sendRequest(`${BASE_PATH}/books`, {
          method: "GET"
        });
        setBooks({ books });
      } catch (err) {
        notify(err);
      }
    })();
  }, []);

  // rendering
  return <Index {...books} />;
};

export default withAuth(IndexWithData, { adminRequired: true });
