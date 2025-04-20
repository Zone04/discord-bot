const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'delete',
    description: 'Supprimer un autoreply',
    usage: [
        {
            name: 'ID',
            description: 'ID de l\'autoreply à supprimer',
            optional: true,
        },
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        return args.length <= 1
    },
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id || message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    },
    execute: async (message, args) => {
        if (args.length == 0) {
            let autoreplies = await message.client.db.AutoReply.findAll({where: {guild:message.guild.id}});
            let txt = "";
            if (autoreplies.length) {
                for (const [i, ap] of autoreplies.entries()) {
                    txt += `    ${i} => ${ap.role} : ${ap.message}\n`
                }
                message.channel.send("Veuillez exécuter la commande en indiquant l'autoreply à supprimer :\n```" + txt + "```");
            } else {
                message.channel.send("Aucun autoreply existant");
            }
        } else {
            let autoreplies = await message.client.db.AutoReply.findAll({where: {guild:message.guild.id}});
            if (autoreplies[args[0]]) {
                await autoreplies[args[0]].destroy();
                message.reply("AutoReply supprimé !");
            }
        }
    }
};