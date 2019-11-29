import React, { Component } from "react";
// import components
import BaseLayout from "../components/layouts/BaseLayout";

class Blogs extends Component {
  render() {
    return (
      <BaseLayout title="This is my blog" description="this is my blog">
        <h1>I am Blogs page</h1>
      </BaseLayout>
    );
  }
}

export default Blogs;
