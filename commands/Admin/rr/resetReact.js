const { PermissionsBitField, DiscordAPIError } = require("discord.js");
const MissingPermissionError = require("../../../errors/MissingPermissionError");
const NoReactionRoleError = require("../../../errors/NoReactionRoleError"); 
const TooManyReactionsError = require("../../../errors/TooManyReactionsError");

let settings = {
    name: 'resetReact',
    description: 'Recréer les réaction sur un message',
    usage: [
        {
            name: 'ChannelMention|ChannelID',
            description: 'Channel dans lequel se situe le ReactionRole'
        },
        {
            name: 'MessageID',
            description: 'ID du message'
        },
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length != 2) return false;
        let chan = await message.client.utils.getChan(message, args[0]);
        if (chan.guild.id != message.guild.id) return false;
        try {
            await chan.messages.fetch(args[1]);
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code == 10008) {
                return false
            }
            throw error;
        }
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    },
    execute: async (message, args) => {
        if (message.client.modules.has('ReactionRoleManager')) {
            let chan = await message.client.utils.getChan(message, args[0]);
            let m = await chan.messages.fetch(args[1]);

            try {
                let permManageMessage = message.guild.members.me.permissionsIn(chan).has(PermissionsBitField.Flags.ManageMessages);
                if (permManageMessage) {
                    await m.reactions.removeAll();
                }
                let rrM = await message.client.modules.get('ReactionRoleManager').search(m);
                await rrM.createReact();
                return message.reply('Réactions réinitialisées');
            } catch (error) {
                if (error instanceof NoReactionRoleError) {
                    return message.reply('Pas de ReactionRole trouvé pour ce message');
                } else if (error instanceof TooManyReactionsError) {
                    return message.reply('Impossible d\'ajouter toutes les réactions. Essayer de supprimer manuellement toutes les réactions avant de recommencer');
                } else if (error instanceof MissingPermissionError) {
                    return message.reply('Impossible d\'ajouter des réactions, permission manquante.');
                } else {
                    throw error;
                }
            }
        } else {
            return message.reply('Module ReactionRoleManager non chargé');
        }
    }
};