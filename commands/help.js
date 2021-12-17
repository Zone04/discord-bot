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

        let helpEmbed = new MessageEmbed()
            .setTitle(`Liste des commandes`)
            .setColor('#FFFFFF');

        commands.forEach(command => {
            console.log(command.name);
            helpEmbed.addFields({
                name: `**${message.client.prefix}${command.name}**`,
                value: `${command.description}`,
                inline: true
            });
        });

        helpEmbed.setTimestamp();

        console.log(helpEmbed);

        return message.reply({embeds: [helpEmbed]});
    },
};