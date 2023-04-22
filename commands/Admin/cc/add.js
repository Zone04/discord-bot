const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'add',
    description: 'Ajoute une CustomCommand',
    usage: [
        {
            name: 'CommandName',
            description: 'Nom de la commande à ajouter'
        },
        {
            name: 'content',
            description: 'Contenu de la commande'
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length <= 1) return false;
        return true;
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageGuild);
    },
    execute: async (message, args) => {
        let name = args.shift();

        let cc = await message.client.db.CustomCommand.findOne({where:{guildId:message.guildId, name:name}});
        let cc2 = await message.client.db.CustomCommand2.findOne({where:{guildId:message.guildId, name:name}});
        if (message.client.commandsManager.commands.has(name) || cc || cc2) {
            return message.reply(`Impossible de créer cette CustomCommand : le nom est déjà pris !`);
        }

        await message.client.db.CustomCommand.create({guildId:message.guildId, name:name, content: args.join(" ")});
        return message.reply(`CustomCommand créée !`);
    }
};