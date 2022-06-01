const utils = require('../../utils.js');
const UserNotFoundError = require('../../errors/UserNotFoundError.js');

let settings = {
    name: 'kiss',
    description: 'Embrasse un utilisateur :3',
    usage: [
        {
            name: 'USERNAME|ID|MENTION',
            description: 'Utilisateur à embrasser',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    check_args: (message, args) => {
        return true;
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
        if (args.length) {
            let user = args.join(' ');

            let guildMember;
            try {
                guildMember = await utils.convertUser(message, user);
            } catch(e) {
                if (e instanceof UserNotFoundError) {
                    message.reply(e.message);
                    return;
                } else {
                    throw e;
                }
            }

            message.channel.send(`:kissing_heart: ${guildMember.user} Tout plein de bisous pour toi :3`);
        } else {
            message.channel.send(`:kissing_heart: Tout plein de bisous pour tout le monde :3`);
        }
    },
};