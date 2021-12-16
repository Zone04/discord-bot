module.exports = {
    name: 'ping',
    description: 'Determine ping between command and reply',
    execute: async(message, args) => {
        let m = await message.channel.send("Pinging...")

        var ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`**:ping_pong: Pong!**\n Le ping est de  \`${ping}ms\`.`);
    },
};