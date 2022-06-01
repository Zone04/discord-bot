const utils = require('../../utils.js');
const axios = require('axios');
const UserNotFoundError = require('../../errors/UserNotFoundError.js');

let settings = {
    name: 'ass',
    description: '(‿ˠ‿)',
    usage: [
        {
            name: 'NOMBRE',
            description: 'Nombre de culs, default 1, max 5',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return message.channel.nsfw;
    },
    check_args: (message, args) => {
        if (args.length == 0) { return true; }
        return args.length == 1 && !isNaN(args[0]) && parseInt(args[0]) <= 5 && parseInt(args[0]) >= 1;
    },
    execute: async(message, args) => {
        let number = 1;
        
        let res = await axios.get('https://reddit.com/r/ass/top.json?limit=100');
        
        if (args.length) {
            number = Math.min(parseInt(args[0]), res.data.data.children.length);
        }
        let bucket = [];
        for (let i=0;i<=res.data.data.children.length;i++) {
            bucket.push(i);
        }
        function getRandomFromBucket() {
            var randomIndex = Math.floor(Math.random()*bucket.length);
            return bucket.splice(randomIndex, 1)[0];
        }

        let ans = '';
        for (let i=0;i<number;i++) {
            ans += res.data.data.children[getRandomFromBucket()].data.url + `\n`;
        }

        message.channel.send(ans);
    },
};