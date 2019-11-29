import React, { Component } from "react";
// import components
import BaseLayout from "../components/layouts/BaseLayout";

class Cv extends Component {
  render() {
    return (
      <BaseLayout
        title="My CV page"
        description="This is the description of the CV page"
      >
        <h1>I am CV Page</h1>
      </BaseLayout>
    );
  }
}

export default Cv;
