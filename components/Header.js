import PropTypes from "prop-types";
import Link from "next/link";
//import MUI
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
// import components
import MenuDrop from "./MenuDrop";
// import Link from "./Link";
// import style css
import { styleToolbar, styleRaisedButton } from "../lib/styled/SharedStyles";

const optionsMenuCustomer = [
  {
    text: "My books",
    href: "/customer/my-books",
    as: "/my-books"
  },
  {
    text: "Log out",
    href: "/logout"
  }
];

const optionsMenuAdmin = [
  {
    text: "Admin",
    href: "/admin"
  },
  {
    text: "Log out",
    href: "/logout"
  }
];

function Header({ user, hideHeader, next }) {
  return (
    <div
      style={{
        overflow: "hidden",
        position: "relative",
        display: "block",
        top: hideHeader ? "-64px" : "0px",
        transition: "top 0.5s ease-in"
      }}
    >
      <Toolbar style={styleToolbar}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          {/* if user not logged in*/}
          <Grid item sm={6} xs={1} style={{ textAlign: "left" }}>
            {!user ? (
              <Link href="/">
                <Avatar
                  src="https://storage.googleapis.com/builderbook/logo.svg"
                  alt="RichardNguyen logo"
                  style={{ margin: "0px auto 0px 10px", cursor: "pointer" }}
                />
              </Link>
            ) : null}
          </Grid>

          {/* User logged in */}
          <Grid item sm={2} xs={2} style={{ textAlign: "right" }}>
            {user && user.isAdmin && !user.isGithubConnected ? (
              <Hidden smDown>
                <a href="/auth/github">
                  <Button
                    variant="contained"
                    color="primary"
                    style={styleRaisedButton}
                  >
                    Connect Github
                  </Button>
                </a>
              </Hidden>
            ) : null}
          </Grid>

          <Grid item sm={4} sx={9} style={{ textAlign: "right" }}>
            {user ? (
              // display right menu for registed user
              <div style={{ whiteSpace: "nowrap" }}>
                {!user.isAdmin ? (
                  <MenuDrop
                    options={optionsMenuCustomer}
                    src={user.avatarUrl}
                    alt={user.displayName}
                  />
                ) : (
                  <MenuDrop
                    options={optionsMenuAdmin}
                    src={user.avatarUrl}
                    alt={user.displayName}
                  />
                )}
              </div>
            ) : (
              // display right menu for unregisted user
              <div>
                <Link href="/book">
                  <a style={{ margin: "20px 20px 0px auto" }}>Book</a>
                </Link>
                <Link href="/tutorials">
                  <a style={{ margin: "20px 20px 0px auto" }}>Tutorials</a>
                </Link>
                <Link
                  href={{ pathname: "/public/login", query: { next } }}
                  as={{ pathname: "/login", query: { next } }}
                >
                  <a style={{ margin: "20px 20px 0px auto" }}>Log in</a>
                </Link>
              </div>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

Header.defaultProps = {
  user: null,
  hideHeader: false,
  next: ""
};

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    isAdmin: PropTypes.bool,
    isGithubConnected: PropTypes.bool
  }),
  hideHeader: PropTypes.bool,
  next: PropTypes.string
};

export default Header;
