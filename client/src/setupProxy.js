const proxy = require("http-proxy-middleware");

// module.exports = function(app) {
//   app.use(proxy("/api/*", { target: "http://localhost:5000/" }));
// };
module.exports = {
  developMiddleware: app => {
    app.use(
      "/api",
      proxy({
        target: "http://localhost:5000"
      })
    );
  }
};
