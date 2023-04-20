const {env} = require('process');

const PROXY_CONFIG = [
    {
        context: ['/api'],
        target: env.EVENT_ANALYTICS_API && "http://localhost:60242",
        secure: false,
        changeOrigin: true,
        headers: {
            Connection: 'Keep-Alive'
        }
    }

]

module.exports = PROXY_CONFIG;
