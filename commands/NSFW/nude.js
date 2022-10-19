const axios = require('axios');

let settings = {
    name: 'nude',
    description: '(ง ͡ʘ ͜ʖ ͡ʘ)ง',
    usage: [
        {
            name: 'NOMBRE',
            description: 'Nombre de nudes, default 1, max 5',
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
        
        let posts = (await message.client.r.getSubreddit('nudes').getTop({limit:100})).filter(post=>!post.stickied).map(post=>post.url);
        
        if (args.length) {
            number = Math.min(parseInt(args[0]), posts.length);
        }
        let bucket = [...Array(posts.length).keys()];
        function getRandomFromBucket() {
            var randomIndex = Math.floor(Math.random()*bucket.length);
            return bucket.splice(randomIndex, 1)[0];
        }

        let ans = '';
        for (let i=0;i<number;i++) {
            ans += posts[getRandomFromBucket()] + `\n`;
        }

        message.channel.send(ans);
    },
};