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
        args = [...args]; // copy array
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
    execute: async (message, args) => {
        // Check the action
        let action = 'toggle';
        if (['toggle', 'view', 'edit'].includes(args[0])) {
            action = args.shift();
        }

        // args now contains only chans and commands

        let chans = [];
        while (await utils.checkChan(message, arg = args.shift() )) {
            chans.push(await utils.getChanId(message, arg));
        }
        if (chans.length == 0) {
            chans.push(message.channel.id);
        }

        let commands = [];
        while (arg) {
            commands.push(arg);
            arg = args.shift();
        }

        // Now we have everything sorted, switch case for action
        if (action == 'toggle') {
            
        } else if (action == 'view') {
            let reply = "";
            for (const chan of chans) {
                reply += `Commandes bloquées dans le chan <#${chan}>:\n`;
                let bl = await utils.getBlacklistChan(message.client, chan);
                if (bl.length == 0) {
                    reply += "Aucune commande bloquée";
                } else {
                    reply += '`' + bl.map(entry => {return message.client.config.prefix + entry.command}).join(' ') + '`';
                }
                reply += `\n\n`
            };
            message.reply(reply);

        } else if (action == 'reset') {

        }
    },
};