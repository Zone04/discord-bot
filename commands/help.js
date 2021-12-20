const { MessageEmbed } = require('discord.js')

let settings = {
    name: 'help',
    description: 'Show list of commands / Usage of a command',
    args: false,
    usage: '[COMMAND.NAME]',
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
            let reply = `\`\`\`${message.client.prefix}${command.name} ${command.usage}\n\n`;
            reply += 'ARG = Argument obligatoire\n'
            reply += '[ARG] = Argument facultatif\n'
            reply += 'ARG1|ARG2 = Choix entre ARG1 et ARG2\n'
            reply += '\`\`\`'
            message.reply(reply);
        }
    },
};