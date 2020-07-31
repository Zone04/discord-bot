module.exports = {
    name: 'spam',
    description: 'Spamme un utilisateur.',
    args: true,
    execute(message, args) {
        message.guild.members.fetch(args[0]).then(user => {
            let name = user.user;
            for (let i = 0; i < args[1]; i++) {
                message.channel.send(`${name}`);
            }
        });
    },
};