const { PermissionsBitField, DiscordAPIError } = require("discord.js");
const NoReactionRoleError = require("../../../errors/NoReactionRoleError");
const RRIgnoreUserError = require("../../../errors/RRIgnoreUserError");

let settings = {
    name: 'addIgnore',
    description: 'Ajoute un utilisateur aux ignorés d\'un message',
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
            name: 'userMention|userId',
            description: 'Utilisateur à ignorer'
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
        // Check user
        if (!isNaN(args[2]) && parseInt(args[2]) >= 0) { // arg is only the user ID
            return true
        } else {
            let match = args[2].match(/^<@!?([0-9]+)>$/);
            return match != null;
        }
    },
    permitted: (client, message) => {
        return message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    },
    execute: async (message, args) => {
        if (message.client.modules.has('ReactionRoleManager')) {
            let chan = await message.client.utils.getChan(message, args[0]);
            let m = await chan.messages.fetch(args[1]);

            let uId
            if (!isNaN(args[2]) && parseInt(args[2]) >= 0) { // arg is only the user ID
                uId = args[2]
            } else {
                let match = args[2].match(/^<@!?([0-9]+)>$/);
                uId = match[1];
            }

            try {
                let rrM = await message.client.modules.get('ReactionRoleManager').search(m);
                await rrM.addIgnore(uId);
                return message.reply('Utilisateur ajouté aux ignorés');
            } catch (error) {
                if (error instanceof NoReactionRoleError) {
                    return message.reply('Pas de ReactionRole trouvé pour ce message');
                } else if (error instanceof RRIgnoreUserError) {
                    return message.reply('Cet utilisateur est déjà ignoré');
                } else {
                    throw error;
                }
            }

        } else {
            return message.reply('Module ReactionRoleManager non chargé');
        }
    }
};