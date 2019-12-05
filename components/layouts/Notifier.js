import React from "react";
// import MUI
import Snackbar from "@material-ui/core/Snackbar";

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: ""
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = ({ message }) => {
    this.setState({ open: true, message });
  };

  handleSnackbarRequestClose = () => {
    this.setState({
      open: false,
      message: ""
    });
  };

  render() {
    const message = (
      <span
        id="snackbar-message-id"
        dangerouslySetInnerHTML={{ __html: this.state.message }}
      />
    );

    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message={message}
        autoHideDuration={5000}
        onClose={this.handleSnackbarRequestClose}
        open={this.state.open}
        ContentProps={{ "aria-describedby": "snackbar-message-id" }}
      />
    );
  }
}

// function to handle open the Snackbar
export function openSnackbar({ message }) {
  openSnackbarFn({ message });
}

export default Notifier;
