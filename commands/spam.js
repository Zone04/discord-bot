const utils = require('../utils.js');

module.exports = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    execute(message, args) {
        utils.convertUser(message, args[0]).then(user => {
            for (let i = 0; i < args[1]; i++) {
                message.channel.send(`${user}`);
            }
        }).catch (e => {
            message.channel.send('Erreur : ' + e);
        });
    },
};