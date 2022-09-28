const { PermissionsBitField, DiscordAPIError } = require("discord.js");
const ReactionRoleDuplicateError = require("../../../errors/ReactionRoleDuplicateError");

let settings = {
    name: 'create',
    description: 'Initialise un ReactionRole',
    usage: [
        {
            name: 'ChannelMention|ChannelID',
            description: 'Channel dans lequel créer le ReactionRole'
        },
        {
            name: 'MessageID',
            description: 'ID du message'
        },
        {
            name: 'single|multiple',
            description: 'Type de ReactionRole',
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        if (args.length != 3) return false;
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
        return (args[2] == 'single' || args[2] == 'multiple');
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    },
    execute: async (message, args) => {
        if (message.client.modules.has('ReactionRoleManager')) {
            let chan = await message.client.utils.getChan(message, args[0]);
            let m = await chan.messages.fetch(args[1]);
            try {
                await message.client.modules.get('ReactionRoleManager').create(m,args[2])
            } catch (error) {
                if (error instanceof ReactionRoleDuplicateError) {
                    return message.reply('Ce message a déjà été initialisé');
                }
                throw error;
            }
            return message.reply(`ReactionRole créé. Utilisez la commande \`${message.client.config.prefix}rr addReaction\` pour ajouter un rôle.`);
        } else {
            return message.reply('Module ReactionRoleManager non chargé');
        }
    }
};