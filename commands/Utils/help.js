const utils = require('../../utils.js');

let settings = {
    name: 'help',
    description: 'Liste les commandes / Utilisation d\'une commande',
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
    check_args: (message, args) => {
        return args.length <= 2;
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
        let commands = message.client.commandsManager.commands;
        if (args.length == 0) {

            commands = commands.sort((a,b)=>{
                if (a.cat>b.cat)
                    return 1;
                if (a.cat<b.cat)
                    return -1;
                return a.name>b.name?1:-1;
            });

            let help = 'Liste des commandes :\n```'

            cat = '';
            commands.forEach(command => {
                let shouldPrint = false;
                if (command.subcommands) {
                    command.subcommands.forEach(subcommand => {
                        shouldPrint = shouldPrint || subcommand.permitted(message.client, message);
                    });
                } else {
                    shouldPrint = command.permitted(message.client, message);
                }
                if (shouldPrint) {
                    if (command.cat != cat){
                        cat = command.cat;
                        help += `\n${cat}\n`;
                    }
                    help += `${message.client.config.prefix}${command.name.concat(' ').padEnd(14, ' ')}${command.description}\n`
                }
            });

            help += '```'

            return message.reply(help);
        } else {
            const commandName = args[0];
            if (!commands.has(commandName)) return message.reply('Pas de commande trouvée');

            const command = commands.get(commandName);
            if (!command.subcommands) {
                if (!command.permitted(message.client, message)) return message.reply('Pas de commande trouvée');
    
                let reply = utils.getHelpMessage(message, command);
                message.reply(reply);
            } else {
                if (args.length < 2 || !command.subcommands.has(args[1])) {
                    let shouldPrint = false;
                    command.subcommands.forEach(subcommand => {
                        shouldPrint = shouldPrint || subcommand.permitted(message.client, message);
                    });
                    if (!shouldPrint) return message.reply('Pas de commande trouvée');
                    let help = 'Liste des sous-commandes de `' + command.name + '` :\n```'
                    command.subcommands.forEach(subcommand => {
                        if (subcommand.permitted(message.client, message)) {
                            help += `${message.client.config.prefix}${command.name} ${subcommand.name.concat(' ').padEnd(14, ' ')}${subcommand.description}\n`
                        }
                    });
                    help += '```'
                    message.reply(help);
                } else {
                    const subcommand = command.subcommands.get(args[1]);
                    if (!subcommand.permitted(message.client, message)) return;

                    let reply = utils.getHelpMessage(message, subcommand, command);
                    message.reply(reply);
                }
            }
            

        }
    },
};