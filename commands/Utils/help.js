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
        let utils = message.client.utils;
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
            for ([_,command] of commands) {
                let shouldPrint = false;
                if (command.subcommands) {
                    for ([_,subcommand] of command.subcommands) {
                        shouldPrint = shouldPrint || await utils.permitted(message, subcommand);
                    };
                } else {
                    shouldPrint = await utils.permitted(message, command);
                }
                if (shouldPrint) {
                    if (command.cat != cat){
                        cat = command.cat;
                        help += `\n${cat}\n`;
                    }
                    help += `${message.client.config.prefix}${command.name.concat(' ').padEnd(14, ' ')}${command.description}\n`
                }
            };

            help += '```'

            return message.reply(help);
        } else {
            const commandName = args[0];
            if (!commands.has(commandName)) return message.reply('Pas de commande trouvée');

            const command = commands.get(commandName);
            if (!command.subcommands) {
                if (!await utils.permitted(message, command)) return message.reply('Pas de commande trouvée');
    
                let reply = utils.getHelpMessage(message, command);
                message.reply(reply);
            } else {
                if (args.length < 2 || !command.subcommands.has(args[1])) {
                    let shouldPrint = false;
                    for ([_, subcommand] of command.subcommands) {
                        shouldPrint = shouldPrint || await utils.permitted(message, subcommand);
                    };
                    if (!shouldPrint) return message.reply('Pas de commande trouvée');
                    let help = utils.getHelpMessage(message, command);
                    message.reply(help);
                } else {
                    const subcommand = command.subcommands.get(args[1]);
                    if (!await utils.permitted(message, subcommand)) return;

                    let reply = utils.getHelpMessage(message, subcommand);
                    message.reply(reply);
                }
            }
            

        }
    },
};