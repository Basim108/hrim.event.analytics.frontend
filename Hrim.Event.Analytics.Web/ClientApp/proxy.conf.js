const {env} = require('process');

const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` 
    :  env.ASPNETCORE_URLS 
        ? env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:7009';
console.log('proxing to target: ' + target)

const PROXY_CONFIG = [
    {
        context: [
            "/account/**"
        ],
        target: target,
        secure: false,
        headers: {
            Connection: 'Keep-Alive'
        }
    }
]

module.exports = PROXY_CONFIG;
