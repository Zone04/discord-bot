const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'list',
    description: 'Liste les CustomCommand',
    usage: [],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length != 0) return false;
        return true;
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && message.channel.nsfw;
    },
    execute: async (message, args) => {
        const ccs = await message.client.db.CustomCommand2.findAll({where:{guildId:message.guildId}});
        if (ccs.length) {
            return message.reply(`Liste des CustomCommand : \`\`\`${ccs.map(cc=>cc.name).join(' ')}\`\`\``);
        }
        return message.reply(`Liste des CustomCommand vide`);
    }
};