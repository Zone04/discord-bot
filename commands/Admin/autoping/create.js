const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'create',
    description: 'Créer un nouvel autoping',
    usage: [
        {
            name: 'RoleMention|RoleID',
            description: 'Rôle pour lequel les mentions seront étendues'
        },
        {
            name: 'Message',
            description: 'Message à envoyer lors de la mention du rôle'
        },
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length < 2) return false;
        let role = await message.client.utils.getRole(message, args[0]);
        if (!role) return false;
        return true;
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    },
    execute: async (message, args) => {
        let role = await message.client.utils.getRole(message, args[0]);
        let toSend = args.slice(1).join(' ');
        
        await message.client.db.AutoPing.create({role: role.id, message:toSend});

        message.reply("AutoPing créé !");
    }
};