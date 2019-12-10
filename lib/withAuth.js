import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";

let globalUser = null;

function withAuth(
  Page,
  { loginRequired = true, logoutRequired = false, adminRequired = false } = {}
) {
  class App extends React.Component {
    // specify propTypes and defaultProps
    static propTypes = {
      user: PropTypes.shape({
        id: PropTypes.string,
        isAdmin: PropTypes.bool
      }),
      isFromServer: PropTypes.bool.isRequired
    };

    static defaultProps = { user: null };

    // get data from server side rendering
    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      const user = ctx.req
        ? ctx.req.user && ctx.req.user.toObject()
        : globalUser;

      if (isFromServer && user) {
        // converting _id from object to string
        user._id = user._id.toString();
      }

      const props = { user, isFromServer };

      // Call child component's "getInitialProps", if it is defined
      if (Page.getInitialProps) {
        Object.assign(props, (await Page.getInitialProps(ctx)) || {});
      }

      return props;
    }

    // mount data before rendering
    componentDidMount() {
      const { user, isFromServer } = this.props;

      if (isFromServer) {
        globalUser = user;
      }

      // Redirect to "/login" if login is required and not logged in
      if (loginRequired && !logoutRequired && !user) {
        Router.push("/public/login", "/login");
        return;
      }

      // if logout is required and user logged in, redirect to '/' page
      if (logoutRequired && user) {
        Router.push("/");
      }

      //
      if (adminRequired && (!user || !user.isAdmin)) {
        Router.push("/customer/my-books", "/my-books");
      }
    }

    render() {
      const { user } = this.props;

      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        return null;
      }

      return <Page {...this.props} />;
    }
  }

  return App;
}

export default withAuth;
