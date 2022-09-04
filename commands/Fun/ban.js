const UserNotFoundError = require('../../errors/UserNotFoundError.js');
const TooManyUsersError = require('../../errors/TooManyUsersError.js');

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
            guildMember = await message.client.utils.convertUser(message, user);
        } catch(e) {
            if (e instanceof UserNotFoundError || e instanceof TooManyUsersError) {
                message.reply(e.message);
                return;
            } else {
                throw e;
            }
        }

        if (guildMember.user.id == message.client.user.id) {
            return message.reply('Très drôle...')
        }
        return message.channel.send(`${guildMember.user} est ban de mon coeur :broken_heart:`);
    },
};