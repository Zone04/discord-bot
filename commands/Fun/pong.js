let settings = {
    name: 'pong',
    description: 'ping ?',
    args: false,
    usage: [],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: (message, args) => {
        message.channel.send('Ping MDR :joy:');
    },
};