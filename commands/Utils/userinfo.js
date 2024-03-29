const UserNotFoundError = require('../../errors/UserNotFoundError.js');
const TooManyUsersError = require('../../errors/TooManyUsersError.js');

let settings = {
    name: 'userinfo',
    description: 'Information sur l\'utilisateur.',
    usage: [
        {
            name: 'USERNAME|ID|MENTION',
            description: 'Utilisateur à récupérer',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    check_args: (message, args) => {
        return true;
    },
    execute: async(message, args) => {
        let user;
        if (!args.length) {
            user = message.author.id;
        } else {
            user = args.join(' ');
        }
        
        let guildMember;
        try {
            guildMember = await message.client.utils.convertUser(message, user);
        } catch(e) {
            if (e instanceof UserNotFoundError || e instanceof TooManyUsersError) {
                return message.reply(e.message);
            } else {
                throw e;
            }
        } 

        message.channel.send(`L'utilisateur s'appelle \`\`${guildMember.user.tag}\`\`\nStatut : \`\`${guildMember.presence?.status ?? 'offline'}\`\`\nCompte créé le \`\`${guildMember.user.createdAt}\`\``);
    },
};