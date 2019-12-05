import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import App from "next/app";
import React from "react";
import Router from "next/router";
import NProgress from "nprogress";
// import styles
import { theme } from "../components/util/theme";
// import components
import Header from "../components/layouts/Header";
import Notifier from "../components/layouts/Notifier";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class MyApp extends App {
  componentDidMount() {
    // remove the server-side injected CSS
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        {/* ThemeProvider makes the theme available down the React tree thanks to React context. */}
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* display Header */}
        <Header {...pageProps} />
        {/* Display pages contents */}
        <Component {...pageProps} />
        {/* Display notifications on page if any */}
        <Notifier />
      </ThemeProvider>
    );
  }
}

export default MyApp;
