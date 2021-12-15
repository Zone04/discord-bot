const utils = require('../utils.js');

module.exports = {
    name: 'userinfo',
    description: 'Information sur l\'utilisateur.',
    execute(message, args) {
        let user;
        if (!args.length) {
            user = message.author.id;
        } else {
            user = args[0];
        }
        utils.convertUser(message, user).then(guildMember => {
            console.log(guildMember);
            message.channel.send(`L'utilisateur s'appelle \`\`${guildMember.user.tag}\`\`\nStatut : \`\`${guildMember.presence.status}\`\`\nCompte créé le \`\`${guildMember.user.createdAt}\`\``);
        }).catch (e => {
            message.channel.send('Erreur : ' + e);
        });
    },
};