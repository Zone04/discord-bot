const utils = require('../../../utils');

let settings = {
    name: 'chan',
    description: 'Ajoute un chan à la liste noire',
    usage: [
        {
            name: 'toggle|view|reset',
            description: 'Action. Valeur par défaut : toggle',
            optional: true
        },
        {
            name: 'CHANNEL(S)',
            description: 'ID ou mention du/des channel(s). Valeur par défaut : channel courant',
            optional: true
        },
        {
            name: 'COMMAND(S)',
            description: 'A utiliser avec "toggle". Commandes à ajouter/retirer. Laisser vide pour tout sélectionner',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        let arg=undefined;
        if (args.length == 0) return true;
        else if (args[0] == 'view' || args[0] == 'reset') {
            args.shift();
            while (arg = args.shift()) { // all remaining args should be channels mention/ID
                let ans = await utils.checkChan(message, arg);
                if (!ans) {
                    return false;
                }
            }
            return true;
        } else if (args[0] == 'toggle' || await utils.checkChan(message, args[0])) {
            args.shift();
            while (await utils.checkChan(message, arg = args.shift() )) {}
            // Still need to check if all remaining args are commands. This is done after the big if to account for the case where the first argument is a command
        } else {
            arg = args.shift();
        }
        while (arg) {
            if (!message.client.commandsManager.commands.has(arg)) return false;
            arg = args.shift();
        }
        return true

    },
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id;
    },
    execute: (message, args) => {
        message.channel.send('BL CHAN');
    },
};