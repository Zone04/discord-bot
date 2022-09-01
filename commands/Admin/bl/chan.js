const utils = require('../../../utils');
const { Op } = require("sequelize");

let settings = {
    name: 'chan',
    description: 'Gère les commandes bloquées dans les chans',
    usage: [
        {
            name: 'toggle|list|reset',
            description: 'Action. Valeur par défaut : toggle',
            optional: true
        },
        {
            name: 'CHANNEL(S)|all',
            description: 'ID ou mention du/des channel(s). `all` pour affecter tout le serveur. Valeur par défaut : channel courant',
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
    cron: [
        {
            schedule: '0 0 * * *', // Every day
            description: 'Remove blacklist entries with deleted chans',
            run: async (client) => {
                const blacklist = await client.db.BlacklistChan.findAll();
                let c = 0;
                for (entry of blacklist){
                    if (!client.channels.resolve(entry.chan)) {
                        entry.destroy();
                        c += 1;
                    }
                }
                console.log(`Found ${c} blacklist entries associated to deleted channels`);
                return `Found ${c} blacklist entries associated to deleted channels`;
            }
        },
        {
            schedule: '0 0 * * *', // Every day
            description: 'Remove blacklist entries with deleted guilds',
            run: async (client) => {
                const blacklist = await client.db.BlacklistGuild.findAll();
                let c = 0;
                for (entry of blacklist){
                    if (!client.guilds.resolve(entry.guildId)) {
                        entry.destroy();
                        c += 1;
                    }
                }
                console.log(`Found ${c} blacklist entries associated to deleted channels`);
                return `Found ${c} blacklist entries associated to deleted channels`;
            }
        },
    ],
    check_args: async (message, args) => {
        args = [...args]; // copy array
        let arg=undefined;
        if (args.length == 0) return true;
        else if (args[0] == 'list' || args[0] == 'reset') {
            args.shift();
            while (arg = args.shift()) { // all remaining args should be channels mention/ID
                let ans = (await utils.checkChan(message, arg)) || arg == 'all';
                if (!ans) {
                    return false;
                }
            }
            return true;
        } else if (args[0] == 'toggle' || await utils.checkChan(message, args[0]) || args[0] == 'all') {
            args.shift();
            while (await utils.checkChan(message, arg = args.shift() ) || arg == 'all') {}
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
        if (['toggle', 'list', 'reset'].includes(args[0])) {
            action = args.shift();
        }

        // args now contains only chans and commands

        let chans = [];
        let guild = [];
        while ((await utils.checkChan(message, arg = args.shift() )) || arg == 'all') {
            if (arg == 'all') {
                guild.push(message.guild.id);
            } else {
                chans.push(await utils.getChanId(message, arg));
            }
        }
        if (chans.length == 0 && guild.length == 0) {
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
            blGuild = [];
            if (guild.length) {
                blGuild = (await utils.getBlacklistGuild(message.client, guild[0])).map(entry=> entry.command);
            }

            let allPresent = chans.every(chan => {
                return commands.every(command => bl[chan].includes(command));
            }) && ( guild.length == 0 || commands.every(command => blGuild.includes(command)));
            let allAbsent = chans.every(chan => {
                return commands.every(command => !bl[chan].includes(command));
            }) && ( guild.length == 0 || commands.every(command => !blGuild.includes(command)));

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
                await message.client.db.BlacklistGuild.destroy({
                    where: {
                        guildId: {
                            [Op.in]: guild
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
                if (chans.length > 0 && guild.length > 0) {
                    reply += 'et '
                }
                if (guild.length > 0) {
                    reply += 'dans tous les chans.'
                }
                return message.reply(reply);
            } else if (allAbsent) {
                let toCreateChan = [];
                let toCreateGuild = []
                for (command of commands) {
                    for (chan of chans) {
                        toCreateChan.push({chan: chan, command: command});
                    }
                    if (guild.length) {
                        toCreateGuild.push({guildId: guild[0], command: command})
                    }
                }
                await message.client.db.BlacklistChan.bulkCreate(toCreateChan);
                await message.client.db.BlacklistGuild.bulkCreate(toCreateGuild);

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
                if (chans.length > 0 && guild.length > 0) {
                    reply += 'et '
                }
                if (guild.length > 0) {
                    reply += 'dans tous les chans.'
                }
                return message.reply(reply);
            } else {
                return message.reply("Les commandes ne sont ni toutes absentes ni toutes présentes dans tous les chans spécififés.\nImpossible d'effectuer une modification.");
            }

        } else if (action == 'list') {
            let reply = "";
            if (guild.length) {
                reply += `Commandes bloquées dans tous les chans:\n`;
                let bl = await utils.getBlacklistGuild(message.client, guild[0]);
                console.log(bl);
                if (bl.length == 0) {
                    reply += "Aucune commande bloquée";
                } else if (bl.some(element => element.command == 'all commands')) {
                    reply += 'Toutes les commandes';
                    if (bl.length > 1) {
                        reply += '\n + `' + bl.filter(entry => entry.command != 'all commands').map(entry => {return message.client.config.prefix + entry.command}).join(' ') + '`';
                    }
                } else {
                    reply += '`' + bl.map(entry => {return message.client.config.prefix + entry.command}).join(' ') + '`';
                }
                reply += `\n\n`
            }
            for (const chan of chans) {
                reply += `Commandes bloquées dans le chan <#${chan}>:\n`;
                let bl = await utils.getBlacklistChan(message.client, chan);
                if (bl.length == 0) {
                    reply += "Aucune commande bloquée";
                } else if (bl.some(element => element.command == 'all commands')) {
                    reply += 'Toutes les commandes';
                    if (bl.length > 1) {
                        reply += '\n + `' + bl.filter(entry => entry.command != 'all commands').map(entry => {return message.client.config.prefix + entry.command}).join(' ') + '`';
                    }
                } else {
                    reply += '`' + bl.map(entry => {return message.client.config.prefix + entry.command}).join(' ') + '`';
                }
                reply += `\n\n`
            };
            message.reply(reply);

        } else if (action == 'reset') {
            let reply = "";
            if (guild.length) {
                await message.client.db.BlacklistGuild.destroy({where: {guildId: guild[0]}});
                reply += `Tous les chans: Blacklist effacée\n`;
            }
            for (const chan of chans) {
                await message.client.db.BlacklistChan.destroy({where: {chan: chan}});
                reply += `<#${chan}>: Blacklist effacée\n`;
            };
            message.reply(reply);
        }
    },
};