let settings = {
    name: 'pong',
    description: 'ping ?',
    usage: [],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: (message, args) => {
        return message.channel.send('Ping MDR :joy:');
    },
};