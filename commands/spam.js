const utils = require('../utils.js');

module.exports = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    execute(message, args) {
        utils.convertUser(message, args[0]).then(user => {
            spam(message.channel, user, args[1], args[1])
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