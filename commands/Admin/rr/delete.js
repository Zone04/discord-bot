const { PermissionsBitField } = require("discord.js");
const NoReactionRoleError = require("../../../errors/NoReactionRoleError");

let settings = {
    name: 'delete',
    description: 'Initialise un ReactionRole',
    usage: [
        {
            name: 'ChannelMention|ChannelID',
            description: 'Channel dans lequel créer le ReactionRole'
        },
        {
            name: 'MessageID',
            description: 'ID du message'
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length != 2) return false;
        try {
            let chan = await message.client.utils.getChan(message, args[0]);
            if (chan.guild.id != message.guild.id) return false;
            await chan.messages.fetch(args[1]);
            return true;
        } catch (error) {
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
            try {
                await message.client.modules.get('ReactionRoleManager').delete(m)
            } catch (error) {
                if (error instanceof NoReactionRoleError) {
                    return message.reply('Pas de ReactionRole trouvé pour ce message');
                }
                throw error;
            }
            return message.reply(`ReactionRole supprimé`);
        } else {
            return message.reply('Module ReactionRoleManager non chargé');
        }
    }
};