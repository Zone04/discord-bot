const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'del',
    description: 'Supprime une CustomCommand',
    usage: [
        {
            name: 'CommandName',
            description: 'Nom de la commande à supprimer'
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length != 1) return false;
        return true;
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && message.channel.nsfw;
    },
    execute: async (message, args) => {
        let cc = await message.client.db.CustomCommand2.findOne({where:{guildId:message.guildId, name:args[0]}});
        if (cc) {
            await cc.destroy();
            return message.reply(`CustomCommand supprimée`);
        }
        return message.reply(`Pas de CustomCommand trouvée`);
    }
};