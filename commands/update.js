module.exports = {
    name: 'update',
    description: 'Fait un git pull sur la branch master',
    execute(message, args) {
        const { exec } = require("child_process")
        message.channel.send('Executing git pull');
        exec('git pull');
        message.channel.send('Done!');
    },
};