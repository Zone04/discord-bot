const utils = require('../../../utils');
const { Op } = require("sequelize");

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
        if (['toggle', 'view', 'reset'].includes(args[0])) {
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
        if (commands.length == 0) commands.push('all commands');

        // Now we have everything sorted, switch case for action
        if (action == 'toggle') {
            // Check all commands are in the same state
            bl = {};
            for (chan of chans) {
                bl[chan] = (await utils.getBlacklistChan(message.client, chan)).map(entry=> entry.command);
            }
            console.log(bl);

            let allPresent = chans.every(chan => {
                return commands.every(command => bl[chan].includes(command));
            });
            let allAbsent = chans.every(chan => {
                return commands.every(command => !bl[chan].includes(command));
            });
            if (commands[0] == 'all commands') {
                allAbsent = chans.every(chan => bl[chan].length == 0);
            }

            if (allPresent) {
                await message.client.db.BlacklistChan.destroy({
                    where: {
                        chan: {
                            [Op.in]: chans
                        },
                        command: {
                            [Op.in]: commands
                        }
                    }
                });

                let reply = '';
                if (commands.length == 1) {
                    if (commands[0] == 'all commands') {
                        reply += 'Les commandes ont été activées '
                    } else {
                        reply += `La commande \``
                        + commands.map(command => {return message.client.config.prefix + command}).join(' ')
                        + `\` a été retirée de la blacklist `;
                    }
                } else {
                    reply += `Les commandes \``
                    + commands.map(command => {return message.client.config.prefix + command}).join(' ')
                    + `\` ont été retirées de la blacklist `;
                }
                if (chans.length == 1) {
                    reply +=  `dans le chan `
                    + chans.map(chan => {return '<#' + chan + '>'}).join(' ');
                } else {
                    reply +=  `dans les chans `
                    + chans.map(chan => {return '<#' + chan + '>'}).join(' ');
                }
                return message.reply(reply);
            } else if (allAbsent) {
                if (chans.some(chan => bl[chan].includes('all commands'))) {
                    return message.reply("Toutes les commandes sont bloquées dans au moins un des chans spécifiés. Impossible d'ajouter une commande spécifique.");
                }
                let toCreate = [];
                for (chan of chans) {
                    for (command of commands) {
                        toCreate.push({chan: chan, command: command});
                    }
                }
                await message.client.db.BlacklistChan.bulkCreate(toCreate);

                let reply = '';
                if (commands.length == 1) {
                    if (commands[0] == 'all commands') {
                        reply += "Toutes les commandes ont été bloquées ";
                    } else {
                        reply += `La commande \``
                        + commands.map(command => {return message.client.config.prefix + command}).join(' ')
                        + `\` a été bloquée `;
                    }
                } else {
                    reply += `Les commandes \``
                    + commands.map(command => {return message.client.config.prefix + command}).join(' ')
                    + `\` ont été bloquées `;
                }
                if (chans.length == 1) {
                    reply +=  `dans le chan `
                    + chans.map(chan => {return '<#' + chan + '>'}).join(' ');
                } else {
                    reply +=  `dans les chans `
                    + chans.map(chan => {return '<#' + chan + '>'}).join(' ');
                }
                return message.reply(reply);
            } else {
                return message.reply("Les commandes ne sont ni toutes absentes ni toutes présentes dans tous les chans spécififés.\nImpossible d'effectuer une modification.");
            }

        } else if (action == 'view') {
            let reply = "";
            for (const chan of chans) {
                reply += `Commandes bloquées dans le chan <#${chan}>:\n`;
                let bl = await utils.getBlacklistChan(message.client, chan);
                if (bl.length == 0) {
                    reply += "Aucune commande bloquée";
                } else if (bl[0].command == 'all commands') {
                    reply += 'Toutes les commandes';
                } else {
                    reply += '`' + bl.map(entry => {return message.client.config.prefix + entry.command}).join(' ') + '`';
                }
                reply += `\n\n`
            };
            message.reply(reply);

        } else if (action == 'reset') {
            let reply = "";
            for (const chan of chans) {
                message.client.db.BlacklistChan.destroy({where: {chan: chan}});
                reply += `<#${chan}>: Blacklist effacée\n`;
            };
            message.reply(reply);
        }
    },
};