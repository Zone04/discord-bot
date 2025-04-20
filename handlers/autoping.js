module.exports = {
    name: 'AutoPing',
    event: 'messageCreate',
    callback: async (message) => {
        if (message.mentions && message.mentions.roles) {
            let autopings = await message.client.db.AutoPing.findAll();
            for (const autoping of autopings) {
                if (message.mentions.roles.has(autoping.role)) {
                    message.reply(autoping.message);
                }
            }
        }
    }
}