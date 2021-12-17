const utils = require('../utils.js');
const { prefix } = require('../config.json')

let settings = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    usage: 'USERNAME|ID|MENTION|random|everyone NUMBER',
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async (message, args) => {
        if (args.length < 2) {
            return message.channel.send(`Usage: \`${prefix}${settings.name} ${settings.usage}\``);
        }
        if (isNaN(args[args.length - 1]) || parseInt(args[args.length - 1]) <= 0) {
            return message.channel.send(`Usage: \`${prefix}${settings.name} ${settings.usage}\``);
        }
        if (parseInt(args[args.length - 1]) > 100000) {
            return message.channel.send(`Tu abuserais pas un peu là ${message.author} ? Je suis raisonnable moi, je fais pas plus de 100000 pings d'un coup`);
        }        

        let content;

        if (args[0] == 'random') {
            let guildMembers = await message.guild.members.fetch();
            content = guildMembers.random().user;
        } else if (args[0] == 'everyone') {
            content = '@everyone';
        } else {
            let guildMember = await utils.convertUser(message, args.slice(0,-1).join(' '));
            content = guildMember.user;
        }

        for (let i = 1; i <= parseInt(args[args.length - 1]); i++) {
            await message.channel.send(`${content}, ${i} / ${args[args.length - 1]}`)
        }
    },
};