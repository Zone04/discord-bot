const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'create',
    description: 'Créer un nouvel autoreply',
    usage: [
        {
            name: 'trigger',
            description: 'Mot auquel le bot répondra'
        },
        {
            name: 'Message',
            description: 'Message à envoyer lors de la détection du mot trigger'
        },
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        return args.length >= 2;
    },
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id || message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    },
    execute: async (message, args) => {
        let toSend = args.slice(1).join(' ');
        
        await message.client.db.AutoReply.create({role: args[0], guild: message.guild.id, message:toSend});

        message.reply("AutoReply créé !");
    }
};