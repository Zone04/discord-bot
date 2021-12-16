let settings = {
    name: 'pong',
    description: 'ping ?',
    args: false,
    usage: '',
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async(message, args) => {
        message.channel.send('Ping MDR :joy:');
    },
};