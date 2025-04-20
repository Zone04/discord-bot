const { PermissionsBitField } = require("discord.js");
const utils = require('../../../utils.js');

let settings = {
    name: 'delete',
    description: 'Supprimer un autoping',
    usage: [
        {
            name: 'ID',
            description: 'ID de l\'autoping à supprimer',
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
            let autoping_from_guild = [];
            let autopings = await message.client.db.AutoPing.findAll({order: [['id','ASC']]});
            for (const autoping of autopings) {
                if (message.guild.roles.resolve(autoping.role)) {
                    autoping_from_guild.push(autoping);
                }
            }
            let txt = "";
            if (autoping_from_guild) {
                for (const [i, ap] of autoping_from_guild.entries()) {
                    txt += `    ${i} => @${message.guild.roles.resolve(ap.role).name} : ${ap.message}\n`
                }
                message.channel.send("Veuillez exécuter la commande en indiquant l'autoping à supprimer :\n```" + txt + "```");
            } else {
                message.channel.send("Aucun autoping existant");
            }
        } else {
            let autoping_from_guild = [];
            let autopings = await message.client.db.AutoPing.findAll({order: [['id','ASC']]});
            for (const autoping of autopings) {
                if (message.guild.roles.resolve(autoping.role)) {
                    autoping_from_guild.push(autoping);
                }
            }
            if (autoping_from_guild[args[0]]) {
                await autoping_from_guild[args[0]].destroy();
                message.reply("AutoPing supprimé !");
            }
        }
    }
};