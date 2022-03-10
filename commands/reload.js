const utils = require('../utils.js');
const fs = require('fs');
const {Collection} = require('discord.js');

module.exports = {
    name: 'reload',
    description: 'Rafraichit une partie du bot',
    usage: [
        {
            name: 'commands|cron|config',
            description: 'Partie à rafraichir',
            optional: false
        }
    ],
    permitted: (client, message) => {
        return client.owner_id == message.author.id;
    },
    execute: (message, args) => {
        if (args.length != 1) {
            return message.reply(utils.getHelpMessage(message.client, message.client.commands.get('reload')));
        }

        if (args[0] == 'commands') {
            let commands = new Collection();
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`../commands/${file}`)];
                const command = require(`../commands/${file}`);
                commands.set(command.name, command);
            }
            message.client.commands = commands;
            return message.reply('Commandes rafraichies !')
        }
        if (args[0] == 'cron') {
            // TODO
            return;
        }
        if (args[0] == 'config') {
            // TODO
            return;
        }

        return message.reply(utils.getHelpMessage(message.client, message.client.commands.get('reload')));
    },
};
