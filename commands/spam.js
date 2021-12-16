const utils = require('../utils.js');

module.exports = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    execute: async (message, args) => {
        if (args.length < 2) {
            return message.channel.send(`Vous devez donner un utilisateur et un nombre de pings ${message.author}`);
        }
        if (isNaN(args[args.length - 1]) || parseInt(args[args.length - 1]) <= 0) {
            return message.channel.send(`Vous devez donner un nombre de pings à envoyer ${message.author}`);
        }
        if (parseInt(args[args.length - 1]) > 100000) {
            return message.channel.send(`Tu abuserais pas un peu là ${message.author} ? Je suis raisonnable moi, je fais pas plus de 100000 pings d'un coup`);
        }        

        guildMember = await utils.convertUser(message, args.slice(0,-1).join(' '))

        for (let i = 1; i <= parseInt(args[args.length - 1]); i++) {
            await message.channel.send(`${guildMember.user}, ${i} / ${args[args.length - 1]}`)
        }
    },
};