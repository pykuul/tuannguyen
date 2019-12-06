import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";

let globalUser = null;

function withAuth(
  BaseComponent,
  { loginRequired = true, logoutRequired = false } = {}
) {
  class App extends React.Component {
    // specify propTypes and defaultProps
    static propTypes = {
      user: PropTypes.shape({
        displayName: PropTypes.string,
        email: PropTypes.string.isRequired
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
      if (BaseComponent.getInitialProps) {
        Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {});
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
        Router.push("/login");
        return;
      }

      // if logout is required and user logged in, redirect to '/' page
      if (logoutRequired && user) {
        Router.push("/");
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

      return <BaseComponent {...this.props} />;
    }
  }

  return App;
}

export default withAuth;
