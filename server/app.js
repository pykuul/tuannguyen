const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongo");

const auth = require("./util/google");
const logger = require("./logs");

const { insertTemplates } = require("./models/EmailTemplate");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev
  ? `http://localhost:${port}`
  : "https://richardnguyen.herokuapp.com";
const MONGO_URL = process.env.MONGO_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};
// connect to Database
mongoose.connect(MONGO_URL, options);

// start the server
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    const server = express();

    // session handling
    const MongoStore = mongoSessionStore(session);

    const sess = {
      name: "richardnguyen.com.sid",
      secret: "HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wk",
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 7 * 24 * 60 * 60 // save session on 7 days
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        Secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000
      }
    };

    server.use(session(sess));

    await insertTemplates();

    // routing handlling
    // this route is served only for cronjob to keep heroku not run to sleep
    server.get("/cronjob", (req, res) => {
      res.status(200).send("I am OK");
    });

    // route for google authentication
    auth({ server, ROOT_URL });

    // this is to forward all the others routes to nextJS handle
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    // start server listen the requrests
    server.listen(port, err => {
      if (err) throw err;
      logger.info(`>Ready on ${ROOT_URL} at port: ${port}`);
    });
  })
  .catch(ex => {
    logger.error(ex.stack);
  });
