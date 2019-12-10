import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import Next
import Error from "next/error";
import Link from "next/link";
// import MUI
import NProgress from "nprogress";
import Button from "@material-ui/core/Button";
// import components
import { getBookDetail, syncBookContent } from "../../lib/api/admin";
import withAuth from "../../lib/withAuth";
import notify from "../../lib/notifier";

const handleSyncContent = bookId => async () => {
  try {
    await syncBookContent({ bookId });
    notify("Synced");
  } catch (err) {
    notify(err);
  }
};

const MyBook = ({ book, error }) => {
  if (error) {
    notify(error);
    return <Error statusCode={500} />;
  }

  if (!book) {
    return null;
  }

  const { chapters = [] } = book;

  return (
    <div style={{ padding: "10px 45px" }}>
      <h2>{book.name}</h2>
      <a
        href={`https://github.com/${book.githubRepo}`}
        target="_bank"
        rel="noopener noreferrer"
      >
        Repo on Github
      </a>
      <p />
      <Button raised onClick={handleSyncContent(book._id)}>
        Sync with Github
      </Button>{" "}
      <Link
        as={`/admin/edit-book/${book.slug}`}
        href={`/admin/edit-book?slug=${book._id}`}
      >
        <Button raised>Edit book</Button>
      </Link>
      <ul>
        {chapters.map(chapter => {
          <li key={chapter._id}>
            <Link
              as={`/books/${book.slug}/${chapter.slug}`}
              href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${chapter.slug}`}
            >
              <a>{chapter.title}</a>
            </Link>
          </li>;
        })}
      </ul>
    </div>
  );
};

MyBook.defaultProps = {
  book: null,
  error: null
};

MyBook.propTypes = {
  book: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  error: PropTypes.string
};

const MyBookWithData = props => {
  // define State
  const [data, setData] = useState({
    loading: true,
    error: null,
    book: null
  });

  // componentDidMount()
  useEffect(async () => {
    NProgress.start();
    try {
      const book = await getBookDetail({ slug: props.slug });
      setData({ book, loading: false });
      NProgress.done();
    } catch (err) {
      setData({ loading: false, error: err.message || err.toString() });
      NProgress.done();
    }
  }, []);

  // rendering
  return <MyBook {...props} {...data} />;
};

MyBookWithData.getInitialProps = ({ query }) => {
  return { slug: query.slug };
};

MyBookWithData.propTypes = {
  slug: PropTypes.string.isRequired
};

export default withAuth(MyBookWithData, { adminRequired: true });
