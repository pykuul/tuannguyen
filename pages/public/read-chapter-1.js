import React from "react";
import PropTypes from "prop-types";
import Error from "next/error";
import Head from "next/head";
// import MUI
import Grid from "@material-ui/core/Grid";

// import { getChapterDetail } from "../../utils/api/public";
import sendRequest from "../../lib/sendRequest";
import withAuth from "../../lib/withAuth";
import notify from "../../lib/notifier";

const styleGrid = {
  flexGrow: "1"
};

class ReadChapter extends React.Component {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired
    })
  };

  static defaultProps = { chapter: null };

  // define state
  constructor(props) {
    super(props);

    const { chapter } = props;

    let htmlContent = "";
    if (chapter) htmlContent = chapter.htmlContent;

    this.state = { chapter, htmlContent };
  }

  static async getInitialProps({ req, query }) {
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

      console.log(`BOOK-NAME: ${chapter.book.name}`);
      console.log(`CHAPTER-TITLE: ${chapter.title}`);
      console.log(`HTMLCONTENT: ${chapter.htmlContent}`);

      return { chapter };
    } catch (err) {
      console.log(err.message);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // render new chapter
    const { chapter } = nextProps;

    if (chapter && chapter._id !== this.props.chapter_id) {
      const { htmlContent } = chapter;
      this.setState({ chapter, htmlContent });
    }
  }

  mainContentMarkup() {
    const { chapter, htmlContent } = this.state;
    return (
      <div>
        <h3>Chapter: {chapter.title}</h3>
        <div
          className="main-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  render() {
    const { chapter } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

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
            {this.mainContentMarkup()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withAuth(ReadChapter, { loginRequired: false });
