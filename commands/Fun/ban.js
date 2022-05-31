const utils = require('../../utils.js');
const UserNotFoundError = require('../../errors/UserNotFoundError.js');

let settings = {
    name: 'ban',
    description: 'Ban un utilisateur',
    usage: [
        {
            name: 'USERNAME|ID|MENTION',
            description: 'Utilisateur à bannir',
            optional: false
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    check_args: (message, args) => {
        return args.length >= 1;
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
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

        message.channel.send(`${guildMember.user} est ban de mon coeur :broken_heart:`);
    },
};