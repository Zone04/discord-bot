const utils = require('../utils.js');

module.exports = {
    name: 'userinfo',
    description: 'Information sur l\'utilisateur.',
    execute: async(message, args) => {
        let user;
        if (!args.length) {
            user = message.author.id;
        } else {
            user = args[0];
        }

        let guildMember = await utils.convertUser(message, user)

        message.channel.send(`L'utilisateur s'appelle \`\`${guildMember.user.tag}\`\`\nStatut : \`\`${guildMember.presence?.status ?? 'offline'}\`\`\nCompte créé le \`\`${guildMember.user.createdAt}\`\``);
    },
};