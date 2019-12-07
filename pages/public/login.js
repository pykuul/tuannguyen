import Head from "next/head";
import Button from "@material-ui/core/Button";

import withAuth from "../../views/utils/withAuth";
import { styleLoginButton } from "../../views/styled/SharedStyles";

const Login = () => (
  <div style={{ textAlign: "center", margin: "0 20px" }}>
    <Head>
      <title>Log in to Builder Book</title>
      <meta name="description" content="Login page for tuannguyen.com" />
    </Head>
    <br />
    <p style={{ margin: "45px auto", fontSize: "44px", fontWeight: "400" }}>
      Log in
    </p>
    <p>You'll be logged in for 7 days unless you log out manually</p>
    <br />
    <Button variant="contained" style={styleLoginButton} href="/auth/google">
      <img
        src="https://storage.googleapis.com/builderbook/G.svg"
        alt="Log in with Google"
        style={{ marginRight: "10px" }}
      />
      Log in with Google
    </Button>
  </div>
);

export default withAuth(Login, { logoutRequired: true });