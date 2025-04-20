const { ChannelType } = require('discord.js');

module.exports = {
    name: 'AutoReply',
    event: 'messageCreate',
    callback: async (message) => {
        const client = message.client;
        if (message.partial) return;
        if (message.author.bot) return;
        // Ignore all channels that are not guild text or thread
        if (!([ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread].includes(message.channel.type))) return;

        let autoreplies = await message.client.db.AutoReply.findAll({where: {guild:message.guild.id}});
        for (const autoreply of autoreplies) {
            if (message.content.includes(autoreply.role)) {
                message.reply(autoreply.message);
            }
        }
    }
}