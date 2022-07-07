const UserNotFoundError = require('./errors/UserNotFoundError.js');

module.exports = {
    convertUser: async function (message, arg) {
        let guildMember = await message.guild.members.fetch({ query: arg, limit: 1 }); // as name
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
        throw new UserNotFoundError('Pas d\'utilisateur trouvé.');
    },

    getHelpMessage: function (message, command, topcommand=undefined) {
        let reply;
        if (command.subcommands) {
            reply = 'Liste des sous-commandes de `' + command.name + '` :\n```'
            command.subcommands.forEach(subcommand => {
                if (subcommand.permitted(message.client, message)) {
                    reply += `${message.client.config.prefix}${command.name} ${subcommand.name.concat(' ').padEnd(14, ' ')}${subcommand.description}\n`
                }
            });
            reply += '\`\`\`';
        } else {
            if (topcommand) {
                reply = `\`\`\`${message.client.config.prefix}${topcommand.name} ${command.name}`;
            } else {
                reply = `\`\`\`${message.client.config.prefix}${command.name}`;
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
        chan.send({"content":text,"allowedMentions": { "users" : []}}).catch();
    },

    checkChan: async function (message, arg) {
        if (!arg) return false;
        // As mention
        if (arg.startsWith('<#') && arg.endsWith('>')) {
            arg = arg.slice(2, -1);
        }
        if (isNaN(arg) || parseInt(arg) < 0) return false;
        // As ID
        try {
            let chan = await message.client.channels.fetch(arg);
            return chan.guild.id == message.guild.id;
        } catch {
            return false;
        }

    }
}