module.exports = {
    convertUser: async function (message, arg) {
        let guildMember = await message.guild.members.fetch({ query: arg, limit: 1 }); // as name
        if (guildMember.size !== 0) {
            return guildMember.first().user;
        }
        try {
            guildMember = await message.guild.members.fetch(arg); // as ID
            return guildMember.user;
        } catch {}
        if (arg.startsWith('<@') && arg.endsWith('>')) { // as mention
            arg = arg.slice(2, -1);
    
            if (arg.startsWith('!')) {
                arg = arg.slice(1);
            }
            try {
                guildMember = await message.guild.members.fetch(arg);
                return guildMember.user;
            } catch {}
        }
        throw 'Pas d\'utilisateur trouvé.';
    }
}