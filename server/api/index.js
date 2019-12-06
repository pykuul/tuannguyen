const adminApi = require("./admin");
const customerApi = require("./customer");
const publicApi = require("./public");

function api(server) {
  server.use("/api/v1/public", publicApi);
  server.use("/api/v1/admin", adminApi);
  server.use("/api/v1/customer", customerApi);
}

module.exports = api;
