const { Permissions } = require("discord.js");

let settings = {
    name: 'roulette',
    description: 'Serez-vous chanceux ?',
    usage: [
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
        if (!message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return message.reply(`Je n'ai pas la permission rendre muet ici :pensive:`);
        }
        if (!message.member.moderatable) {
            return message.reply(`Impossible pour moi de te rendre muet :pensive:`);
        }
        message.channel.send(`${message.author} *place l'arme contre sa tempe...*`)
        .then(_ => setTimeout(_ => {
            if (Math.random() > 0.75) {
                message.channel.send(`*Et tire. La balle part. ${message.author} meurt.* :skull:`);
                message.member.timeout(60*1000, 'roulette');
            } else {
                message.channel.send(`*Et tire. La chambre était vide ! ${message.author} a survécu !* :tada:`);
            }
        }, 2000)
        );
    },
};