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
        if (args.length >= 2) return false;
        return args.length == 0 || parseInt(args[0]) >= 0;
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    },
    execute: async (message, args) => {
        if (args.length == 0) {
            let autoreply_from_guild = [];
            let autoreplies = await message.client.db.AutoReply.findAll({order: [['id','ASC']]});
            for (const autoreply of autoreplies) {
                if (message.guild.roles.resolve(autoreply.role)) {
                    autoreply_from_guild.push(autoreply);
                }
            }
            let txt = "";
            if (autoreply_from_guild) {
                for (const [i, ap] of autoreply_from_guild.entries()) {
                    txt += `    ${i} => @${message.guild.roles.resolve(ap.role).name} : ${ap.message}\n`
                }
                message.channel.send("Veuillez exécuter la commande en indiquant l'autoreply à supprimer :\n```" + txt + "```");
            } else {
                message.channel.send("Aucun autoreply existant");
            }
        } else {
            let autoreply_from_guild = [];
            let autoreplies = await message.client.db.AutoReply.findAll({order: [['id','ASC']]});
            for (const autoreply of autoreplies) {
                if (message.guild.roles.resolve(autoreply.role)) {
                    autoreply_from_guild.push(autoreply);
                }
            }
            if (autoreply_from_guild[args[0]]) {
                await autoreply_from_guild[args[0]].destroy();
                message.reply("AutoReply supprimé !");
            }
        }
    }
};