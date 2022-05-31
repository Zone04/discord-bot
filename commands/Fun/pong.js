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
        message.channel.send('Ping MDR :joy:');
    },
};