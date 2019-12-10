import Router from "next/router";
import NProgress from "nprogress";
// import components
import withAuth from "../../lib/withAuth";
import EditBook from "../../components/admin/EditBook";
import notify from "../../lib/notifier";
import { addBook, syncBookContent } from "../../lib/api/admin";

const AddBook = () => {
  const addBookOnSave = async data => {
    NProgress.start();
    try {
      const book = await addBook(data);
      notify("Saved");
      try {
        const bookId = book._id;
        await syncBookContent({ bookId });
        notify("Synced");
        NProgress.done();
        Router.push(
          `/admin/book-detail?slug=${book.slug}`,
          `/admin/book-detail/${book.slug}`
        );
      } catch (err) {
        notify(err);
        NProgress.done();
      }
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  };

  return (
    <div style={{ padding: "10px 45px" }}>
      <EditBook onSave={addBookOnSave} />
    </div>
  );
};

export default withAuth(AddBook, { adminRequired: true });
