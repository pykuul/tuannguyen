const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongo");

const auth = require("./util/google");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
// connect Database
const MONGO_URL = process.env.MONGO_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(MONGO_URL, options);

// start the server
const port = process.env.PORT || 3000;
const ROOT_URL = `http://localhost:${port}`;
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // session handling
    const MongoStore = mongoSessionStore(session);

    const sess = {
      name: "builderBook.sid",
      secret: "HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wk",
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60 // save session on 14 days
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000
      }
    };

    server.use(session(sess));
    auth({ server, ROOT_URL });

    // routes handlling
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    // server listen handling
    server.listen(port, err => {
      if (err) throw err;
      console.log(`>Ready on server port: ${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
  });
