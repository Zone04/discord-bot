const { Message } = require('discord.js');

module.exports = {
    name: 'spam',
    execute: async (client) => {
        const spams = await client.db.Spam.findAll();
        spams.forEach(async spam => {
            console.log('Found spam');
            console.log(`${spam.source} spammed ${spam.target}, ${spam.progress} out of ${spam.number} in ${spam.channel}`);

            channel = await client.channels.fetch(spam.channel);
            fakeMessage = new Message(
                client,
                {
                    id: "fake",
                    author: { id: spam.source },
                    content: `${client.prefix}spam ${spam.id}`,
                    channel_id: spam.channel,
                    fake: true
                }
            );
            client.emit("messageCreate", fakeMessage);
        });
    }
};