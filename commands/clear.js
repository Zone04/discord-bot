module.exports = {
    name: 'clear',
    description: 'Clear a specified number of messages',
    execute: async(message, args) => {
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.channel.send(`Vous devez donner un nombre de messages à supprimer ${message.author}`);
        }

        let toDelete = parseInt(args[0]) > 99 ? 100 : parseInt(args[0]) + 1;

        messages = await message.channel.messages.fetch({ limit: toDelete });
        await message.channel.bulkDelete(messages, true);
    },
};