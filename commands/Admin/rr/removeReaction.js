const { PermissionsBitField } = require("discord.js");
const NoReactionRoleError = require("../../../errors/NoReactionRoleError");

let settings = {
    name: 'removeReaction',
    description: 'Retirn un rôle du message',
    usage: [
        {
            name: 'ChannelMention|ChannelID',
            description: 'Channel dans lequel se situe le ReactionRole'
        },
        {
            name: 'MessageID',
            description: 'ID du message'
        },
        {
            name: 'roleMention|roleId',
            description: 'Rôle à utiliser'
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length != 3) return false;
        try {
            let chan = await message.client.utils.getChan(message, args[0]);
            if (chan.guild.id != message.guild.id) return false;
            await chan.messages.fetch(args[1]);
            // Check role
            let rId;
            if (!isNaN(args[2]) && parseInt(args[2]) >= 0) { // arg is only the role ID
                rId = args[2];
            } else {
                let match = args[2].match(/^<@&([0-9]+)>$/);
                if (match == null) return false;
                rId = match[1];
            }
            return await message.guild.roles.fetch(rId) != null;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    },
    execute: async (message, args) => {
        if (message.client.modules.has('ReactionRoleManager')) {
            let chan = await message.client.utils.getChan(message, args[0]);
            let m = await chan.messages.fetch(args[1]);

            let rId;
            if (!isNaN(args[2]) && parseInt(args[2]) >= 0) { // arg is only the role ID
                rId = args[2];
            } else {
                let match = args[2].match(/^<@&([0-9]+)>$/);
                if (match == null) return false;
                rId = match[1];
            }

            try {
                let rrM = await message.client.modules.get('ReactionRoleManager').search(m);
                await rrM.removeReaction(rId);
                return message.reply('Rôle retiré');
            } catch (error) {
                if (error instanceof NoReactionRoleError) {
                    return message.reply('Pas de ReactionRole trouvé pour ce message');
                } else {
                    throw error;
                }
            }
        } else {
            return message.reply('Module ReactionRoleManager non chargé');
        }
    }
};