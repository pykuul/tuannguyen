const passport = require("passport");
const Strategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/User");

function auth({ ROOT_URL, server }) {
  // TODO: 1. define `verify` function: get profile and googleToken from Google
  const verify = async (accessToken, refreshToken, profile, verified) => {
    let email, avatarUrl;

    if (profile.emails) {
      email = profile.emails[0].value;
    }

    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value.replace("sz=50", "sz=128");
    }
    // TODO: 2. call and wait for static method `signInOrSignUp` to return user
    try {
      const user = await User.signInOrSignUp({
        googleId: profile.id,
        email,
        googleToken: { accessToken, refreshToken },
        displayName: profile.displayName,
        avatarUrl
      });
      // verified(err, user, info)
      // in case of success, we return null for error and user : verified(null, user)
      verified(null, user);
    } catch (err) {
      // in case of error, we return null for user and err : verified(err, null)
      verified(err);
      console.log(err);
    }
  };

  passport.use(
    new Strategy(
      {
        clientID: process.env.Google_ClientID,
        clientSecret: process.env.Google_ClientSecret,
        callbackURL: `${ROOT_URL}/oauth2callback`
      },
      verify
    )
  );
  // TODO: 3. serialize user AND
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // deserialize user;
  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields(), (err, user) => {
      done(err, user);
      console.log("deserializeUser", id);
    });
  });
  // TODO: 4. initial passport AND
  server.use(passport.initialize());
  // save session to keep user logged in (via browser cookie);
  server.use(passport.session());
  // Express routing for login and sign up by using google
  server.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account"
    })
  );

  server.get(
    "/oauth2callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );

  server.get("/logout", (req, res) => {
    // delete req.user and remove user session from passport
    req.logout();
    // redirect to login page
    res.redirect("/login");
  });
}

module.exports = auth;
