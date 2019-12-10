// import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
// import MUI

// import components
import withAuth from "../lib/withAuth";

const Index = ({ user }) => {
  return (
    <div style={{ padding: "10px 45px" }}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="List of purchased books" />
      </Head>
      <p>Dashboard</p>
      {user && user.email ? <p>Email: {user.email}</p> : null}
    </div>
  );
};

Index.defaultProps = {
  user: null
};

Index.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired
  })
};

export default withAuth(Index);
