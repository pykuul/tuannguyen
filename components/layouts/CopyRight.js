// import MUI
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";

const CopyRight = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {"Copyright @ "}
    <MuiLink color="inherit" href="https://thietbidiennhe.com">
      thietbidiennhe.com
    </MuiLink>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

export default CopyRight;
