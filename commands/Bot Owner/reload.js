const cron = require('node-cron');

module.exports = {
    name: 'reload',
    description: 'Rafraichit une partie du bot',
    usage: [
        {
            name: 'commands|config|cron|utils',
            description: 'Partie à rafraichir',
            optional: false
        }
    ],
    check_args: (message, args) => {
        if (args.length != 1) return false;
        return ['commands', 'config', 'cron', 'utils'].includes(args[0]);
    },
    permitted: (client, message) => {
        return client.config.owner_id == message.author.id;
    },
    execute: (message, args) => {
        if (args[0] == 'commands') {
            message.client.commandsManager.reload();
            return message.reply('Commandes rafraichies !')
        }
        if (args[0] == 'cron') {
            message.client.cronjobs.forEach(cronjob => {cronjob.stop(); delete cronjob;});
            message.client.cronjobs = new Array();
            delete require.cache[require.resolve('../../cron/index.js')];
            const cronScripts = require('../../cron/index.js');
            cronScripts.forEach(script => {
                console.log(`Starting cron job: ${script.name}`);
                message.client.cronjobs.push(cron.schedule(script.schedule, async() => { script.run(message.client) }));
            });
            return message.reply('Cron rafraichis !');
        }
        if (args[0] == 'config') {
            delete require.cache[require.resolve('../../config.json')];
            message.client.config = require('../../config.json');
            return message.reply('Configuration rafraichie !');
        }
        if (args[0] == 'utils') {
            delete require.cache[require.resolve('../../utils.js')];
            message.client.utils = require('../../utils.js');
            return message.reply('Utils rafraichis !');
        }
    },
};
