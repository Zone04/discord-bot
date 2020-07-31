module.exports = {
    name: 'update',
    description: 'Fait un git pull sur la branch master',
    execute(message, args) {
        message.channel.send('Executing git fetch');
        exec('git pull');
        message.channel.send('Done!');
    },
};