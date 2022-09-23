module.exports = {
    name: 'reactionRoleCheck',
    description: 'Delete ReactionRole no longer usable because of deleted elements',
    schedule: '*/30 * * * * *', // Every day at midnight
    run: async (client) => {
        let rrMs = await client.db.ReactionRoleMessage.findAll();
        rrMs.forEach(async rrM => {
            let chan = client.channels.resolve(rrM.chanId);
            if (chan == null) {
                console.log('Deleted for chan null')
                return rrM.destroy();
            } else if (chan.messages.resolve(rrM.messageId) == null) {
                console.log('Deleted for message null')
                return rrM.destroy();
            }

            let rrEs = await rrM.getReactionRoleEmojis();
            rrEs.forEach(rrE => {
                if (chan.guild.roles.resolve(rrE.roleId) == null) {
                    console.log('Deleted for role null')
                    return rrE.destroy();
                }
                if (chan.guild.emojis.resolve(rrE.emoji) == null && !client.utils.isUnicodeEmoji(rrE.emoji)) {
                    console.log('Deleted for emoji null')
                    return rrE.destroy();
                }
                
            })

        });
    },
};