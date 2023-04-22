let settings = {
    name: 'ping',
    description: 'Determine le ping bot/serveur',
    usage: [],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
        let m = await message.channel.send("Pinging...")

        var ping = m.createdTimestamp - message.createdTimestamp;
        return m.edit(`**:ping_pong: Pong!**\n Le ping est de  \`${ping}ms\`.`);
    },
};