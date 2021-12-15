const utils = require('../utils.js');

module.exports = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    execute(message, args) {
        utils.convertUser(message, args.slice(0,-1).join(' ')).then(guildMember => {
            spam(message.channel, guildMember.user, args[args.length - 1], args[args.length - 1])
        }).catch (e => {
            message.channel.send('Erreur : ' + e);
        });
    },
};

function spam(channel, user, count, total) {
    if (count > 0) {
        count--;
        channel.send(`${user}, ${count} pings restant sur ${total}`).then(() => {
            spam(channel, user, count, total);
        });
    }
}