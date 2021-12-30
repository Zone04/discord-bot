const { Permissions } = require("discord.js");
const utils = require('../utils.js');

let settings = {
    name: 'clear',
    description: 'Clear a specified number of messages',
    args: true,
    usage: [
        {
            name: 'NUMBER',
            description: 'Nombre de messages à supprimer (jusque 100)',
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async(message, args) => {
        if (!message.member.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            console.log(`User ${message.author} tried clearing messages in channel ${message.channel}`);
            return;
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
        }

        if (!message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.reply(`Je n'ai pas la permission de supprimmer des messages ici :pensive:`);
        }

        let toDelete = parseInt(args[0]) > 99 ? 100 : parseInt(args[0]) + 1;

        messages = await message.channel.messages.fetch({ limit: toDelete });
        await message.channel.bulkDelete(messages, true);
    },
};