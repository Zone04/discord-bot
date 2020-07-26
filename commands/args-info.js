module.exports = {
    name: 'args-info',
    description: 'Information sur les arguments donnés.',
    args: true,
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nLongueur des arguments: ${args.length}`);
    },
};