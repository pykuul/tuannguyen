import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import Error from "next/error";
import NProgress from "nprogress";
// import components
import EditBook from "../../components/admin/EditBook";
import { getBookDetail, editBook } from "../../lib/api/admin";
import withAuth from "../../lib/withAuth";
import notify from "../../lib/notifier";

const EditBook = props => {
  // define Component's State
  const [{ error, book }, setState] = useState({ error: null, book: null });

  // componentDidMount()
  useEffect(async () => {
    NProgress.start();

    try {
      const book = await getBookDetail({ slug: props.slug });
      setState({ book });
      NProgress.done();
    } catch (err) {
      setState({ error: err.message || err.toString() });
      NProgress.done();
    }
  }, []);

  // editBookOnSave method
  const editBookOnSave = async data => {
    NProgress.start();

    try {
      const editedBook = await editBook({ ...data, id: book._id });
      notify("Saved");
      NProgress.done();
      Router.push(
        `/admin/book-detail?slug=${editedBook.slug}`,
        `/admin/book-detail/${editedBook.slug}`
      );
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  };

  // rendering
  if (error) {
    notify(error);
    return <Error statusCode={500} />;
  }

  if (!book) return null;

  return (
    <div style={{ padding: "10px 45px" }}>
      <EditBook onSave={editBookOnSave} book={book} />
    </div>
  );
};

EditBook.getInitialProps = ({ query }) => {
  return { slug: query.slug };
};

EditBook.propTypes = {
  slug: PropTypes.string.isRequired
};

export default withAuth(EditBook, { adminRequired: true });
