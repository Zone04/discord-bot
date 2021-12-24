const utils = require('../utils.js');

let settings = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    usage: [
        {
            name: 'USERNAME|ID|MENTION|random|everyone',
            description: 'Utilisateur à spammer'
        },
        {
            name: 'NUMBER',
            description: 'Nombre de ping à envoyer',
        }
    ]
};

let LIMIT = 10000;

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async (message, args) => {
        if (args.length < 2 || isNaN(args[args.length - 1]) || parseInt(args[args.length - 1]) <= 0) {
            return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
        }
        if (parseInt(args[args.length - 1]) > LIMIT) {
            return message.channel.send(`Tu abuserais pas un peu là ${message.author} ? Je suis raisonnable moi, je fais pas plus de ${LIMIT} pings d'un coup`);
        }

        let content;

        if (args[0] == 'random') {
            let guildMembers = await message.guild.members.fetch();
            content = guildMembers.filter(member => !member.user.bot).random().user;
            console.log(`${message.author.tag} (${message.author.id}) spammed randomly ${content.tag} (${content.id})`);
        } else if (args[0] == 'everyone' || args[0] == '@everyone') {
            content = '@everyone';
            console.log(`${message.author.tag} (${message.author.id}) spammed everyone`);
        } else {
            let guildMember = await utils.convertUser(message, args.slice(0,-1).join(' '));
            if (guildMember.user.bot) return message.reply("Je vais quand même pas spam un bot, ce serait inutile !");
            content = guildMember.user;
            console.log(`${message.author.tag} (${message.author.id}) spammed ${guildMember.user.tag} (${guildMember.user.id})`);
        }

        let spamInstance = await message.client.db.Spam.create({source: message.author.id, target: content.id?? 'other', number: parseInt(args[args.length - 1]), channel: message.channel.id});

        for (let i = 1; i <= parseInt(args[args.length - 1]); i++) {
            await message.channel.send(`${content}, ${i} sur ${args[args.length - 1]}`)
            spamInstance.progress = i;
            await spamInstance.save();
        }

        await spamInstance.destroy();
    },
};