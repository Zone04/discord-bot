const utils = require('../../utils.js');
const UserNotFoundError = require('../../errors/UserNotFoundError.js');

let settings = {
    name: 'unban',
    description: 'Unban un utilisateur',
    args: false,
    usage: [
        {
            name: 'USERNAME|ID|MENTION',
            description: 'Utilisateur à débannir',
            optional: false
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
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

        message.channel.send(`${guildMember.user} est déban de mon coeur :heart:`);
    },
};