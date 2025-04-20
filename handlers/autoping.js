module.exports = {
    name: 'AutoReply',
    event: 'messageCreate',
    callback: async (message) => {
        if (message.mentions && message.mentions.roles) {
            let autoreplies = await message.client.db.AutoReply.findAll();
            for (const autoreply of autoreplies) {
                if (message.mentions.roles.has(autoreply.role)) {
                    message.reply(autoreply.message);
                }
            }
        }
    }
}