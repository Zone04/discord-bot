const utils = require('../utils.js');

module.exports = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    execute: async (message, args) => {
        guildMember = await utils.convertUser(message, args.slice(0,-1).join(' '))

        for (let i = 1; i <= parseInt(args[1]); i++) {
            await message.channel.send(`${guildMember.user}, ${i} / ${args[1]}`)
        }
    },
};