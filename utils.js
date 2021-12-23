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
        throw 'Pas d\'utilisateur trouvé.';
    },

    getHelpMessage: function (client, command) {
        let reply = `\`\`\`${client.prefix}${command.name}`
        command.usage?.forEach(arg => { reply += ` ${arg.optional ? '[':''}${arg.name}${arg.optional ? ']':''}`; });
        reply += '\n\n'
        command.usage?.forEach(arg => {
            reply += `${arg.name}${arg.optional ? ' - optionnel':''}\n`;
            reply += `  ${arg.description}\n`;
        })
        reply += '\`\`\`'

        return reply;
    }
}