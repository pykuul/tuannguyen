import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
// import MUI
import Button from "@material-ui/core/Button";
// import components
import withAuth from "../components/util/withAuth";
import notify from "../components/util/notifier";

class Index extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string.isRequired
    })
  };

  static defaultProps = {
    user: null
  };

  render() {
    const { user } = this.props;

    return (
      <div style={{ padding: "10px 45px" }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="List of purchased books" />
        </Head>
        <p>Dashboard</p>
        {user && user.email ? <p>Email: {user.email}</p> : null}

        <Button variant="contained" onClick={() => notify("success message")}>
          Click me to test notify()
        </Button>
      </div>
    );
  }
}

export default withAuth(Index, { loginRequired: true });
