const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongo");

const auth = require("./utils/google");
const api = require("./api");
const logger = require("./logs");
const { insertTemplates } = require("./models/EmailTemplate");

require("dotenv").config();
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const ROOT_URL = dev
  ? `http://localhost:${port}`
  : "https://richardnguyen.herokuapp.com";

module.exports = { dev, port, ROOT_URL, MONGO_URL };

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

    server.use(express.json());

    // ====> fix error: deserializeUser runs 10x times
    // give all Nextjs's request to Nextjs server
    server.get("/_next/*", (req, res) => {
      handle(req, res);
    });

    server.get("/static/*", (req, res) => {
      handle(req, res);
    });
    // end of fix <======

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
        maxAge: 14 * 24 * 60 * 60 * 1000
      }
    };

    if (!dev) {
      server.set("trust proxy", 1); // sets req.hostname, req.ip
      sess.cookie.secure = true; // sets cookie over https only
    }

    server.use(session(sess));

    await insertTemplates();

    const URL_MAP = {
      "/login": "/public/login",
      "/about": "/public/about",
      "/blogs": "/public/blogs",
      "/cv": "/public/cv",
      "/portfolios": "/public/portfolios"
    };

    // routing handling
    // this route is served only for cronjob to keep heroku not run to sleep
    server.get("/cronjob", (req, res) => {
      res.status(200).send("I am OK");
    });

    // route for google authentication
    auth({ server, ROOT_URL });

    // api endpoint handling
    api(server);

    // route for public pages
    server.get("/books/:bookSlug/:chapterSlug", (req, res) => {
      const { bookSlug, chapterSlug } = req.params;
      app.render(req, res, "/public/read-chapter", { bookSlug, chapterSlug });
    });

    // route for admin pages
    server.get("/admin/book-detail/:slug", (req, res) => {
      const { slug } = req.params;
      app.render(req, res, "/admin/book-detail", { slug });
    });

    server.get("/admin/edit-book/:slug", (req, res) => {
      const { slug } = req.params;
      app.render(req, res, "/admin/edit-book", { slug });
    });

    // this is to forward all the others routes to nextJS handle
    server.get("*", (req, res) => {
      const url = URL_MAP[req.path];

      if (url) {
        return app.render(req, res, url);
      } else {
        return handle(req, res);
      }
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
