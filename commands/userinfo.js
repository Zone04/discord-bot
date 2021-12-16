const utils = require('../utils.js');

let settings = {
    name: 'userinfo',
    description: 'Information sur l\'utilisateur.',
    args: false,
    usage: '[USERNAME|ID|MENTION]',
}
module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    execute: async(message, args) => {
        let user;
        if (!args.length) {
            user = message.author.id;
        } else {
            user = args.join(' ');
        }

        let guildMember = await utils.convertUser(message, user)

        message.channel.send(`L'utilisateur s'appelle \`\`${guildMember.user.tag}\`\`\nStatut : \`\`${guildMember.presence?.status ?? 'offline'}\`\`\nCompte créé le \`\`${guildMember.user.createdAt}\`\``);
    },
};