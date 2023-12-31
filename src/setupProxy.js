const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        "/webapi",
        createProxyMiddleware({
            target: "http://127.0.0.1:3000",
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                "^/webapi": "",
            },
        })
    );
};
