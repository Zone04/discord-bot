const utils = require('../../utils.js');
const UserNotFoundError = require('../../errors/UserNotFoundError.js');

let settings = {
    name: 'userinfo',
    description: 'Information sur l\'utilisateur.',
    args: false,
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
    args: settings.args,
    usage: settings.usage,
    permitted: (client, message) => {
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
            guildMember = await utils.convertUser(message, user);
        } catch(e) {
            if (e instanceof UserNotFoundError) {
                message.reply(e.message);
                return;
            } else {
                throw e;
            }
        } 

        message.channel.send(`L'utilisateur s'appelle \`\`${guildMember.user.tag}\`\`\nStatut : \`\`${guildMember.presence?.status ?? 'offline'}\`\`\nCompte créé le \`\`${guildMember.user.createdAt}\`\``);
    },
};