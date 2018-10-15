const dev = false;
module.exports = {
    baseUrl: '/quote/',
    lintOnSave: false,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        open: process.platform === "darwin",
        host: "localhost",
        port: "8080",
        https: false,
        hotOnly: false,
        proxy: {
            "/klkl": {
                target: dev ? "https://kaka.kelibbb.com" : "https://kaka.kelibbb.com",
                changeOrigin: true,
                pathRewirte: {
                    "^/klkl": "/klkl"
                }
            }
        },
        before: app => {
        }
    }
};
