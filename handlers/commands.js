const { ChannelType } = require('discord.js');

module.exports = {
    name: 'Commands',
    event: 'messageCreate',
    callback: async (message) => {
        const client = message.client;
        if (message.partial) return;
        if (message.author.bot) return;
        // Tell no response if DM channel
        if (message.channel.type === ChannelType.DM) {
            return message.reply({ content: 'Je suis un bot. Je ne répondrais pas ici !', allowedMentions: { repliedUser: false }})
        }
        // Ignore all channels that are not guild text or thread
        if (!([ChannelType.GuildText, ChannelType.PublicThread, ChannelType.PrivateThread].includes(message.channel.type))) return;
        if (!message.content.startsWith(client.config.prefix)) return;
    
        const args = message.content.slice(client.config.prefix.length).replace(/ +$/,'').split(/ +/);
        const commandName = args.shift();
    
        if (!client.commandsManager.commands.has(commandName)) {
            // Command does not exist, checking customcommands
            const cc = await client.db.CustomCommand.findOne(
                {
                    where: {
                        guildId: message.guildId,
                        name: commandName
                    }
                }
            );
            if (cc) {
                return message.channel.send(cc.content);
            }
            if (message.channel.nsfw) {
                const cc2 = await client.db.CustomCommand2.findOne(
                    {
                        where: {
                            guildId: message.guildId,
                            name: commandName
                        }
                    }
                );
                if (cc2) {
                    return message.channel.send(cc2.content);
                }
            }
            return;
        };
    
        let command = client.commandsManager.commands.get(commandName);
    
        if (command.subcommands) {
            const subcommandName = args.shift();
            if (!command.subcommands.has(subcommandName)) {
                if (!(await client.utils.permitted(message, command))) return;
                return message.reply('Sous-commande inexistante\n'+client.utils.getHelpMessage(message, command));
            }
            command = command.subcommands.get(subcommandName);
        }

        try {
            if (!(await client.utils.permitted(message, command))) return;
        
            if (!(await command.check_args?.(message, args) ?? args.length==0)) {
                reply = client.utils.getHelpMessage(message, command);
        
                return message.reply(reply);
            }
    
            await command.execute(message, args)
        } catch(error) {
            console.error(error);
            message.reply(`Uh Oh... Une erreur est survenue !`).catch(_ => {});
        }
    },
};