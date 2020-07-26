module.exports = {
    name: 'userinfo',
    description: 'Information sur l\'utilisateur.',
    args: true,
    execute(message, args) {
        message.guild.members.fetch(args[0]).then(user => {
            let name = user.user;
            message.channel.send(`L'utilisateur ${args[0]} s'appelle  ${name}`);
        });
    },
};