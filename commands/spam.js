const utils = require('../utils.js');
const UserNotFoundError = require('../errors/UserNotFoundError.js');
const { Message } = require('discord.js');

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

let startup = async (client) => {
    const spams = await client.db.Spam.findAll();
    spams.forEach(async spam => {
        console.log('Found spam');
        console.log(`${spam.source} spammed ${spam.target}, ${spam.progress} out of ${spam.number} in ${spam.channel}`);

        channel = await client.channels.fetch(spam.channel);
        fakeMessage = new Message(
            client,
            {
                id: "fake",
                author: { id: spam.source },
                content: `${client.prefix}spam ${spam.id}`,
                channel_id: spam.channel,
                fake: true
            }
        );

        execute(fakeMessage, [spam.id])
            .catch(error => {
                console.error(`Spam couldn't resume. Removing spam.`);
                console.error(error);
                spam.destroy();
            });
    });
};

let execute = async (message, args) => {

    let start = 1;
    let spamInstance;

    // Get infos from DB if we're resuming a spam
    if (message.id == 'fake') {
        spamInstance = await message.client.db.Spam.findByPk(args[0]);
        args = [spamInstance.target, spamInstance.number];
        start = spamInstance.progress + 1;
    }

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
        let guildMember;
        try {
            guildMember = await utils.convertUser(message, args.slice(0,-1).join(' '));
        } catch(e) {
            if (e instanceof UserNotFoundError) {
                message.reply(e.message);
                return;
            } else {
                throw e;
            }
        } 
        if (guildMember.user.bot) return message.reply("Je vais quand même pas spam un bot, ce serait inutile !");
        content = guildMember.user;
        console.log(`${message.author.tag} (${message.author.id}) spammed ${guildMember.user.tag} (${guildMember.user.id})`);
    }

    if (message.id != 'fake') {
        spamInstance = await message.client.db.Spam.create({source: message.author.id, target: content.id?? 'other', number: parseInt(args[args.length - 1]), channel: message.channel.id});
    }

    for (let i = start; i <= parseInt(args[args.length - 1]); i++) {
        await message.channel.send(`${content}, ${i} sur ${args[args.length - 1]}`)
        spamInstance.progress = i;
        await spamInstance.save();
    }

    await spamInstance.destroy();
};

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    startup: startup,
    execute: execute,
};