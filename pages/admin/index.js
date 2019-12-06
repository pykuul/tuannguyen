// default list all the books we have in the database
import { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import Button from "@material-ui/core/Button";

import notify from "../../components/util/notifier";
import withAuth from "../../components/util/withAuth";
import { getBookList } from "../../components/util/api/admin";

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

class IndexWithData extends Component {
  state = {
    books: []
  };

  async componentDidMount() {
    try {
      const { books } = await getBookList();
      this.setState({ books });
    } catch (err) {
      notify(err);
    }
  }

  render() {
    return <Index {...this.state} />;
  }
}

export default withAuth(IndexWithData, { adminRequired: true });
