const utils = require('../../utils.js');
const UserNotFoundError = require('../../errors/UserNotFoundError.js');
const { Message } = require('discord.js');
const TooManyUsersError = require('../../errors/TooManyUsersError.js');

let settings = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    usage: [
        {
            name: 'USERNAME|ID|MENTION|random|everyone',
            description: 'Utilisateur à spammer'
        },
        {
            name: 'NUMBER|random',
            description: 'Nombre de ping à envoyer',
        }
    ]
};

let LIMIT = 10000;

let getSetting = async (client, guildId) => {
    let setting = await client.db.Setting.findByPk(guildId);
    return setting;
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
                        content: `${client.config.prefix}spam ${spam.id}`,
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
    let setting = await getSetting(message.client, message.guild.id);
    let limit = setting?.spamLimit ?? LIMIT
    let spamInstance;

    // Get infos from DB if we're resuming a spam
    if (message.id == 0) {
        spamInstance = await message.client.db.Spam.findByPk(args[0]);
        args = [spamInstance.target, spamInstance.number];
        start = spamInstance.progress + 1;
    }

    if (parseInt(args[args.length - 1]) > limit && args[args.length - 1] !== 'random' && message.id != 0) { // Bypass check if resuming
        return message.channel.send(`Tu abuserais pas un peu là ${message.author} ? Je suis raisonnable moi, je fais pas plus de ${limit} pings d'un coup`);
    }

    if (args[args.length - 1] === 'random') { args[args.length - 1] = Math.ceil(Math.random()*limit); }

    args[args.length - 1] = parseInt(args[args.length - 1]);

    let content;

    if (args.length == 2 && args[0] == 'random') {
        let guildMembers = (await message.channel.members).filter(member => !member.user.bot);
        guildMembers.set('everyone',{user: '@everyone'});
        content = guildMembers.random().user;
    } else if (args.length == 2 && (args[0] == 'everyone' || args[0] == '@everyone')) {
        content = '@everyone';
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
            } else if (e instanceof TooManyUsersError) {
                message.reply(e.message);
                return;
            } else {
                throw e;
            }
        }
        if (!message.channel.members.has(guildMember.user.id)) return message.reply("Cet utilisateur n'a pas accès à ce chan, je ne vais pas le spam dans le vide !");
        if (guildMember.user.bot) return message.reply("Je vais quand même pas spam un bot, ce serait inutile !");
        content = guildMember.user;
    }

    // No easter egg if command is currently blacklisted
    let blacklisted = 
        (await utils.getBlacklistChan(message.client, message.channel.id))
            .some(entry => entry.command == 'spam' || entry.command == 'all commands')
        || (await utils.getBlacklistGuild(message.client, message.guild.id))
            .some(entry => entry.command == 'spam' || entry.command == 'all commands');
    if (!blacklisted) {
        let rand = Math.random()
        if (rand < (setting.easterProba ?? 0.01) && message.id !== 0) { // 1% chance of backfire, but not when resuming
            args = [message.author.id, limit];
            content = message.author;
            await message.channel.send(`https://tenor.com/view/reverse-nozumi-uno-jojo-card-gif-15706915`);
            utils.sendLogMessage(message.client, message.guild.id, `Easter egg triggered on ${message.author}`);
        }
    }

    if (message.id !== 0) {
        spamInstance = await message.client.db.Spam.create({source: message.author.id, target: content.id?? 'everyone', number: parseInt(args[args.length - 1]), channel: message.channel.id});
        if (args[0] == 'everyone' || args[0] == '@everyone') {
            console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed ${args[args.length - 1]} time(s) everyone`);
            utils.sendLogMessage(message.client, message.guild.id, `[CHANNEL ${message.channel}] User ${message.author} spammed ${args[args.length - 1]} time(s) everyone`);
        } else if (args[0] == 'random') {
            if (content == '@everyone') {
                console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed randomly ${args[args.length - 1]} time(s) everyone`);
                utils.sendLogMessage(message.client, message.guild.id, `[CHANNEL ${message.channel}] User ${message.author} spammed randomly ${args[args.length - 1]} time(s) everyone`);
            } else {
                console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed randomly ${args[args.length - 1]} time(s) User ${content.id}`);
                utils.sendLogMessage(message.client, message.guild.id, `[CHANNEL ${message.channel}] User ${message.author} spammed randomly ${args[args.length - 1]} time(s) User ${content}`);
            }
        } else {
            console.log(`[GUILD ${message.guild.id}][CHANNEL ${message.channel.id}] User ${message.author.id} spammed ${args[args.length - 1]} time(s) User ${content.id}`);
            utils.sendLogMessage(message.client, message.guild.id, `[CHANNEL ${message.channel}] User ${message.author} spammed ${args[args.length - 1]} time(s) User ${content}`);
        }
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
    check_args: (message, args) => {
        return args.length >= 2
            && !( args[args.length - 1] !== 'random' && (isNaN(args[args.length - 1]) || parseInt(args[args.length - 1]) <= 0) )
    },
    usage: settings.usage,
    cron: cron,
    permitted: (client, message) => {
        return true;
    },
    execute: execute,
};