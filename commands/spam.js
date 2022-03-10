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

let getLimit = async (client, guildId) => {
    let setting = await client.db.Setting.findByPk(guildId);
    return setting?.spamLimit ?? LIMIT;
}

let cron = [
    {
        schedule: '0 * * * *', // Every whole hour
        description: 'Remove old stalled spams',
        run: async (client) => {
            const spams = await client.db.Spam.findAll({
                where: {
                    updatedAt: {
                        [client.db.Sequelize.Op.lt]: new Date(new Date() - 24*60*60*1000)
                    }
                }
            });
            if (spams.length) {
                console.log(`Found ${spams.length} dead spam(s)`);
            }
            spams.forEach(async spam => {
                spam.destroy();
            })
            return `Found ${spams.length} dead spam(s)`;
        }
    },
    {
        schedule: '5-55/5 * * * *', // Every 5 minutes except whole hours
        description: 'Attempts to resume stalled spams',
        run: async (client) => {
            const spams = await client.db.Spam.findAll({
                where: {
                    updatedAt: {
                        [client.db.Sequelize.Op.lt]: new Date(new Date() - 240*1000)
                    }
                }
            });
            if (spams.length) {
                console.log(`Found ${spams.length} stalled spam(s)`);
            }
        
            spams.forEach(spam => {
                console.log(`Attempt to resume spam ${spam.id}`);
        
                fakeMessage = new Message(
                    client,
                    {
                        id: 0,
                        author: { id: spam.source },
                        content: `${client.prefix}spam ${spam.id}`,
                        channel_id: spam.channel,
                        fake: true
                    }
                );
        
                execute(fakeMessage, [spam.id])
                    .catch(error => {
                        console.error(error);
                    });
            });

            return `Found ${spams.length} stalled spam(s)`
        }
    }
];

let execute = async (message, args) => {

    let start = 1;
    let limit = await getLimit(message.client, message.guild.id);
    let spamInstance;

    // Get infos from DB if we're resuming a spam
    if (message.id == 0) {
        spamInstance = await message.client.db.Spam.findByPk(args[0]);
        args = [spamInstance.target, spamInstance.number];
        start = spamInstance.progress + 1;
    }

    if (args.length < 2 || ( args[args.length - 1] !== 'random' && (isNaN(args[args.length - 1]) || parseInt(args[args.length - 1]) <= 0))) {
        return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
    }
    if (parseInt(args[args.length - 1]) > limit && args[args.length - 1] !== 'random') {
        return message.channel.send(`Tu abuserais pas un peu là ${message.author} ? Je suis raisonnable moi, je fais pas plus de ${limit} pings d'un coup`);
    }

    if (args[args.length - 1] === 'random') { args[args.length - 1] = Math.ceil(Math.random()*limit); }

    let content;

    let rand = Math.random()
    if (rand < 0.01 && message.id !== 0) { // 1% chance of backfire, but not when resuming
        args = [message.author.id, limit];
        await message.channel.send(`Ba alors ?`);
        await message.channel.send(`On a voulu spam ????`);
        await message.channel.send(`Dommage hein, mais pas cette fois.`);
        await message.channel.send(`Quoique... Vengeance !`);
        await message.channel.send(`Allez c'est cadeau c'est pour moi !`);
    }

    if (args.length == 2 && args[0] == 'random') {
        let guildMembers = await message.guild.members.fetch();
        content = guildMembers.filter(member => !member.user.bot).random().user;
        console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed randomly User ${content.id}`);
    } else if (args.length == 2 && (args[0] == 'everyone' || args[0] == '@everyone')) {
        content = '@everyone';
        console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed everyone`);
    } else {
        let guildMember;
        try {
            guildMember = await utils.convertUser(message, args.slice(0,-1).join(' '));
        } catch(e) {
            if (e instanceof UserNotFoundError) {
                // If we were trying to resume and this happens, it means user left the guild, so we instantly delete the spam
                if (message.id == 0) {
                    spamInstance.destroy();
                    return;
                }
                message.reply(e.message);
                return;
            } else {
                throw e;
            }
        } 
        if (guildMember.user.bot) return message.reply("Je vais quand même pas spam un bot, ce serait inutile !");
        content = guildMember.user;
        console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed User ${guildMember.user.id}`);
    }

    if (message.id != 0) {
        spamInstance = await message.client.db.Spam.create({source: message.author.id, target: content.id?? 'everyone', number: parseInt(args[args.length - 1]), channel: message.channel.id});
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
    cron: cron,
    execute: execute,
};