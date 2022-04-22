let settings = {
    name: 'speak',
    description: 'Fait parler le bot dans un chan spécifique.',
    args: false,
    usage: [
        {
            name: 'CHAN_ID',
            description: 'Channel dans lequel parler',
            optional: false
        },
        {
            name: 'MESSAGE',
            description: 'Message à envoyer',
            optional: false
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id;
    },
    execute: async(message, args) => {
        let chanId = args[0];
        let toSend = args.slice(1).join(' ');

        try {
            let chan = await message.guild.channels.fetch(chanId);
            await chan.send(toSend);
        } catch (error) {
            message.reply("Impossible de trouver ce chan")
        }

    },
};