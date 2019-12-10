import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Error from "next/error";
import Head from "next/head";
// import MUI
import Grid from "@material-ui/core/Grid";
// import components
import { getChapterDetail } from "../../lib/api/public";
import withAuth from "../../lib/withAuth";
import sendRequest from "../../lib/sendRequest";

const styleGrid = {
  flexGrow: "1"
};

const ReadChapter = props => {
  // define state
  const [{ chapter, htmlContent }, setChapter] = useState({
    chapter: props.chapter,
    htmlContent: props.chapter.htmlContent ? props.chapter.htmlContent : ""
  });

  // componentWillRecieptProps(nextProps)
  useEffect(() => {
    // render new chapter
    setChapter({
      chapter: props.chapter,
      htmlContent: props.chapter.htmlContent
    });
  }, [props.chapter]);

  if (!chapter) {
    return <Error statusCode={404} />;
  }

  // define render for main content
  const mainContentMarkup = () => {
    return (
      <div>
        <h3>Chapter: {chapter.title}</h3>
        <div
          className="main-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  };

  const { book } = chapter;

  return (
    <div style={{ padding: "10px 45px" }}>
      <Head>
        <title>
          {chapter.title === "Introduction"
            ? "Introduction"
            : `Chapter ${chapter.order - 1}. ${chapter.title}`}
        </title>
        {chapter.seoDescription ? (
          <meta name="description" content={chapter.seoDescription} />
        ) : null}
      </Head>

      <Grid
        style={styleGrid}
        container
        direction="row"
        justify="space-around"
        align="flex-start"
      >
        <Grid
          item
          sm={10}
          xs={12}
          style={{ textAlign: " left", paddingLeft: "25px" }}
        >
          <h2>Book: {book.name}</h2>
          {mainContentMarkup()}
        </Grid>
      </Grid>
    </div>
  );
};

ReadChapter.propTypes = {
  chapter: PropTypes.shape({
    _id: PropTypes.string.isRequired
  })
};

ReadChapter.defaultProps = { chapter: null };

ReadChapter.getInitialProps = async ({ req, query }) => {
  // call API method
  const { bookSlug, chapterSlug } = query;
  const BASE_PATH = "/api/v1/public";
  const headers = {};

  if (req && req.headers && req.headers.cookie) {
    headers.cookie = req.headers.cookie;
  }

  // fetch chapter details
  try {
    const chapter = await sendRequest(
      `${BASE_PATH}/get-chapter-detail?bookSlug=${bookSlug}&chapterSlug=${chapterSlug}`,
      Object.assign({ method: "GET" }, { headers })
    );

    return { chapter };
  } catch (err) {
    console.error(err);
  }
};

export default withAuth(ReadChapter, { loginRequired: false });
