const utils = require('../utils.js');

let settings = {
    name: 'help',
    description: 'Show list of commands / Usage of a command',
    args: false,
    usage: [
        {
            name: 'COMMAND',
            description: 'Nom de la commande, sans préfixe',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async(message, args) => {
        let commands = message.client.commands;
        if (args.length == 0) {

            let help = 'Liste des commandes :\n```'

            commands.forEach(command => {
                help += `${message.client.prefix}${command.name.concat(' ').padEnd(14, ' ')}${command.description}\n`
            });

            help += '```'

            return message.reply(help);
        } else {
            const commandName = args[0];
            if (!commands.has(commandName)) return message.reply('Pas de commande trouvée');

            const command = commands.get(commandName);
            let reply = utils.getHelpMessage(message.client, command);
            message.reply(reply);
        }
    },
};