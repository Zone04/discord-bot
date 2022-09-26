const { PermissionsBitField } = require("discord.js");
const NoReactionRoleError = require("../../../errors/NoReactionRoleError"); 
const RoleNotFoundError = require("../../../errors/RoleNotFoundError");
const TooManyReactionsError = require("../../../errors/TooManyReactionsError");
const UnassignableRoleError = require("../../../errors/UnassignableRoleError");

let settings = {
    name: 'addReaction',
    description: 'Ajoute un rôle au message',
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
            name: 'emote|emoteId',
            description: 'Emote à utiliser (emote de base ou de ce serveur uniquement)'
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
        if (args.length != 4) return false;
        try {
            let chan = await message.client.utils.getChan(message, args[0]);
            if (chan.guild.id != message.guild.id) return false;
            await chan.messages.fetch(args[1]);
            // Check emote
            if (!message.client.utils.isUnicodeEmoji(args[2])){ //not unicode, check if it is an emote from the guild
                let eId;
                if (!isNaN(args[2]) && parseInt(args[2]) >= 0) { // arg is only the emote ID
                    eId = args[2];
                } else {
                    let match = args[2].match(/^<a?:\w+:([0-9]+)>$/);
                    if (match == null) return false;
                    eId = match[1];
                }
                try { await chan.guild.emojis.fetch(eId) } catch (error) {
                    if (error instanceof DiscordAPIError && (error.code == 10014 || error.code == 50001)) { // Unknown message / Missing permission
                        return false;
                    } else {
                        throw error;
                    }
                }
            }
            // Emote is OK
            // Check role
            let rId;
            if (!isNaN(args[3]) && parseInt(args[3]) >= 0) { // arg is only the role ID
                rId = args[3];
            } else {
                let match = args[3].match(/^<@&([0-9]+)>$/);
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

            let emoji = args[2];
            if (!message.client.utils.isUnicodeEmoji(args[2])){
                if (!isNaN(args[2]) && parseInt(args[2]) >= 0) {
                    emoji = args[2];
                } else {
                    let match = args[2].match(/^<a?:\w+:([0-9]+)>$/);
                    if (match == null) return false;
                    emoji = match[1];
                }
            }

            let rId;
            if (!isNaN(args[3]) && parseInt(args[3]) >= 0) { // arg is only the role ID
                rId = args[3];
            } else {
                let match = args[3].match(/^<@&([0-9]+)>$/);
                if (match == null) return false;
                rId = match[1];
            }

            try {
                let rrM = await message.client.modules.get('ReactionRoleManager').search(m);
                await rrM.addReaction(emoji, rId, message.guild);
                return message.reply('Rôle ajouté');
            } catch (error) {
                if (error instanceof NoReactionRoleError) {
                    return message.reply('Pas de ReactionRole trouvé pour ce message');
                } else if (error instanceof TooManyReactionsError) {
                    return message.reply('Impossible d\'ajouter le rôle : trop de rôles enregistrés pour ce message');
                } else if (error instanceof RoleNotFoundError) {
                    return message.reply('Rôle non trouvé. Ce message ne doit normalement jamais apparaitre');
                } else if (error instanceof UnassignableRoleError) {
                    return message.reply('Ce rôle ne peut pas être manuellement attribué');
                } else {
                    throw error;
                }
            }
        } else {
            return message.reply('Module ReactionRoleManager non chargé');
        }
    }
};