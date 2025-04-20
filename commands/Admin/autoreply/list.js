const { PermissionsBitField } = require("discord.js");

let settings = {
    name: 'list',
    description: 'Liste les autoreply existants',
    usage: [],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    check_args: async (message, args) => {
        return true;
    },
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id || message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    },
    execute: async (message, args) => {
        let autoreplies = await message.client.db.AutoReply.findAll({where: {guild:message.guild.id}});
        let txt = "";
        if (autoreplies.length) {
            for (const [i, ap] of autoreplies.entries()) {
                txt += `    ${i} => ${ap.role} : ${ap.message}\n`
            }
            message.channel.send("```" + txt + "```");
        } else {
            message.channel.send("Aucun autoreply existant");
        }
    }
};
