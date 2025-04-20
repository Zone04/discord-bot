const UserNotFoundError = require('./errors/UserNotFoundError.js');
const TooManyUsersError = require('./errors/TooManyUsersError.js');
const emojiregex = require('emoji-regex');
const { PermissionsBitField } = require("discord.js");

module.exports = {
    convertUser: async function (message, arg) {
        let guildMember = await message.guild.members.fetch({ query: arg, limit: 2 }); // as name
        if (guildMember.size == 2) {
            throw new TooManyUsersError(`La recherche d'utilisateur \`${arg}\` a donné plus d'un résultat. Affinez votre recherche.`);
        }
        if (guildMember.size !== 0) {
            return guildMember.first();
        }
        try {
            guildMember = await message.guild.members.fetch(arg); // as ID
            return guildMember;
        } catch {}
        if (arg.startsWith('<@') && arg.endsWith('>')) { // as mention
            arg = arg.slice(2, -1);
    
            if (arg.startsWith('!')) {
                arg = arg.slice(1);
            }
            try {
                guildMember = await message.guild.members.fetch(arg);
                return guildMember;
            } catch {}
        }
        throw new UserNotFoundError(`Pas d'utilisateur trouvé pour la recherche \`${arg}\`.`);
    },

    getHelpMessage: function (message, command) {
        let reply;
        if (command.subcommands) {
            reply = 'Liste des sous-commandes de `' + command.name + '` :\n```\n'
            command.subcommands.forEach(subcommand => {
                if (subcommand.permitted(message.client, message)) {
                    reply += `${message.client.config.prefix}${command.name} ${subcommand.name.concat(' ').padEnd(14, ' ')}${subcommand.description}\n`
                }
            });
            reply += '\`\`\`';
        } else {
            if (command.parent) {
                reply = `\`\`\`\n${message.client.config.prefix}${command.parent} ${command.name}`;
            } else {
                reply = `\`\`\`\n${message.client.config.prefix}${command.name}`;
            }
            command.usage?.forEach(arg => { reply += ` ${arg.optional ? '[':''}${arg.name}${arg.optional ? ']':''}`; });
            reply += `\n\n${command.description}\n\n`;
            command.usage?.forEach(arg => {
                reply += `${arg.name}${arg.optional ? ' - optionnel':''}\n`;
                reply += `  ${arg.description}\n`;
            });
            reply += '\`\`\`';
        }

        return reply;
    },

    sendLogMessage: async function (client, guildId, text) {
        let [setting, created] = await client.db.Setting.findOrCreate({where:{id: guildId}});
        if (created) {
            await setting.reload();
        }
        if (!setting.logChan) return;

        let chan = client.channels.cache.get(setting.logChan);
        chan.send({"content":text,"allowedMentions": { "users" : []}}).catch(console.error);
    },

    sendLogSpamMessage: async function (client, guildId, text) {
        let [setting, created] = await client.db.Setting.findOrCreate({where:{id: guildId}});
        if (created) {
            await setting.reload();
        }
        if (!setting.logChanSpam) return;

        let chan = client.channels.cache.get(setting.logChanSpam);
        chan.send({"content":text,"allowedMentions": { "users" : []}}).catch(console.error);
    },

    getChan: async function (message, arg) {
        if (arg.startsWith('<#') && arg.endsWith('>')) {
            arg = arg.slice(2, -1);
        }
        let chan = await message.client.channels.fetch(arg);
        return chan;
    },

    getChanId: async function (message, arg) {
        return (await this.getChan(message,arg)).id;
    },

    checkChan: async function (message, arg) {
        if (!arg) return false;
        if (arg == 'all') return true;
        if (arg.startsWith('<#') && arg.endsWith('>')) {
            arg = arg.slice(2, -1);
        }
        if (isNaN(arg) || parseInt(arg) < 0) return false;

        try {
            let chan = await this.getChan(message, arg);
            return chan.guild.id == message.guild.id;
        } catch {
            return false;
        }
    },

    getBlacklistChan: async function (client, chanId) {
        let blacklist = await client.db.BlacklistChan.findAll({where:{chan: chanId}});

        // Remove entries with non-existing commands
        blacklist = blacklist.filter(entry => {
            if (!client.commandsManager.commands.has(entry.command) && entry.command != 'all commands') {
                entry.destroy().catch(error => {console.error("Could not delete BlacklistChan entry"); console.error(error)});
                return false;
            }
            return true;
        });

        return blacklist;
    },

    getBlacklistGuild: async function (client, guildId) {
        let blacklist = await client.db.BlacklistGuild.findAll({where:{guildId: guildId}});

        // Remove entries with non-existing commands
        blacklist = blacklist.filter(entry => {
            if (!client.commandsManager.commands.has(entry.command) && entry.command != 'all commands') {
                entry.destroy().catch(error => {console.error("Could not delete BlacklistChan entry"); console.error(error)});
                return false;
            }
            return true;
        });

        return blacklist;
    },

    permitted: async function (message, command) {
        let blacklistGuild = await message.client.db.BlacklistGuild.findAll({where: {guildId: message.guild.id}});
        let blacklistChan = await message.client.db.BlacklistChan.findAll({where: {chan: message.channel.id}});
        let blacklistUser = await message.client.db.BlacklistUser.findAll({where: {guild_id: message.guild.id}});

        // Guild owner and admins not affected by blacklist
        if (message.author.id !== message.guild.ownerId && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            // Check blacklistChan
            let name = command.parent ?? command.name;
            if (blacklistGuild.some(entry => entry.command == 'all commands' || entry.command == name)){
                return false;
            }
            if (blacklistChan.some(entry => entry.command == 'all commands' || entry.command == name)){
                return false;
            }
            if (blacklistUser.some(entry => entry.user == message.author.id)) {
                return false;
            }
        }

        if (!command.subcommands) {
            return command.permitted(message.client, message);
        } else {
            return command.subcommands.some(subcommand => subcommand.permitted(message.client, message));
        }
    },

    isUnicodeEmoji: function (string) {
        const emojis = [...string.matchAll(emojiregex())];
        return emojis.length == 1 && emojis[0][0].length == string.length;
    }
}