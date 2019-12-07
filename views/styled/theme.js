// import MUI
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: grey[700] },
    type: "light"
  },
  error: {},
  background: {},
  typography: {
    useNextVariants: true
  }
});

export { theme };
