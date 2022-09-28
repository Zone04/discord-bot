const { PermissionsBitField } = require("discord.js");
const NoReactionRoleError = require("../../../errors/NoReactionRoleError");
const RRIgnoreUserError = require("../../../errors/RRIgnoreUserError");

let settings = {
    name: 'viewIgnore',
    description: 'Liste les utilisateurs ignorés d\'un message',
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
        try {
            let chan = await message.client.utils.getChan(message, args[0]);
            if (chan.guild.id != message.guild.id) return false;
            await chan.messages.fetch(args[1]);
            return true;
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

            try {
                let rrM = await message.client.modules.get('ReactionRoleManager').search(m);
                if (rrM._ignores.size == 0) {
                    return message.reply('Aucun utilisateur n\'est ignoré');
                }
                let r = 'Liste des utilisateurs ignorés : \n';
                rrM._ignores.forEach((v,k)=>{ r += `<@${k}>\n`; });
                return message.reply(r);
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