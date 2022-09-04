const { Permissions } = require("discord.js");

let settings = {
    name: 'clear',
    description: 'Efface autant de message que spécifié',
    usage: [
        {
            name: 'NUMBER',
            description: 'Nombre de messages à supprimer',
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    check_args: (message, args) => {
        return args.length == 1 && !isNaN(args[0]) && parseInt(args[0]) >= 1
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return message.member.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES);
    },
    execute: async(message, args) => {

        if (!message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.reply(`Je n'ai pas la permission de supprimer des messages ici :pensive:`);
        }

        let toDelete = parseInt(args[0]) // > 99 ? 100 : parseInt(args[0]) + 1;

        while (toDelete > 0) {
            let temp = toDelete > 99 ? 100 : toDelete+1
            messages = await message.channel.messages.fetch({ limit: temp });
            await message.channel.bulkDelete(messages, true);
            toDelete = toDelete - temp;
        }
    },
};