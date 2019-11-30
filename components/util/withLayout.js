import React from "react";
import CssBaseLine from "@material-ui/core/CssBaseline";
import Header from "../layouts/Header";

function withLayout(BaseComponent) {
  class App extends React.createElementComponent {
    render() {
      return (
        <div>
          <CssBaseLine />
          <Header {...this.props} />
          <BaseComponent {...this.props} />
        </div>
      );
    }
  }

  return App;
}

export default withLayout;
