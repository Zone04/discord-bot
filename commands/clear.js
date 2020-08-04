module.exports = {
    name: 'clear',
    description: 'Clear a specified number of messages',
    execute(message, args) {
        message.channel.messages.fetch({ limit: args[0] }).then(messages => {
            message.channel.bulkDelete(messages)
        });
    },
};