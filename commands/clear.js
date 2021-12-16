const { prefix } = require('../config.json')

let settings = {
    name: 'clear',
    description: 'Clear a specified number of messages',
    args: true,
    usage: 'NUMBER',
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async(message, args) => {
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.channel.send(`Usage: \`${prefix}${settings.name} ${settings.usage}\``);
        }

        let toDelete = parseInt(args[0]) > 99 ? 100 : parseInt(args[0]) + 1;

        messages = await message.channel.messages.fetch({ limit: toDelete });
        await message.channel.bulkDelete(messages, true);
    },
};