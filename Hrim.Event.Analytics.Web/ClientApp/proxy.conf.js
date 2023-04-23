const {env} = require('process');

const target = 'https://localhost:7009';

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
