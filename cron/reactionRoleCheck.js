const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'reactionRoleCheck',
    description: 'Delete ReactionRole no longer usable because of deleted elements',
    schedule: '*/30 * * * * *', // Every day at midnight
    run: async (client) => {
        let rrMs = await client.db.ReactionRoleMessage.findAll();
        rrMs.forEach(async rrM => {
            let chan;
            try { chan = await client.channels.fetch(rrM.chanId) } catch (error) {
                if (error instanceof DiscordAPIError && (error.code == 10003 || error.code == 50001)) { // Unknown channel / Missing permission
                    console.log('Deleted rrM without channel');
                    return rrM.destroy();
                } else {
                    throw error;
                }
            }
            try { await chan.messages.fetch(rrM.messageId) } catch (error) {
                if (error instanceof DiscordAPIError && (error.code == 10008 || error.code == 50001)) { // Unknown message / Missing permission
                    console.log('Deleted rrM without message');
                    return rrM.destroy();
                } else {
                    throw error;
                }
            }

            let rrEs = await rrM.getReactionRoleEmojis();
            rrEs.forEach(async rrE => {
                if (await chan.guild.roles.fetch(rrE.roleId) == null) {
                    console.log('Deleted rrE without role');
                    return rrE.destroy();
                }
                if (!client.utils.isUnicodeEmoji(rrE.emoji)){
                    try { await chan.guild.emojis.fetch(rrE.emoji) } catch (error) {
                        if (error instanceof DiscordAPIError && (error.code == 10014 || error.code == 50001)) { // Unknown message / Missing permission
                            console.log('Deleted rrE without emoji');
                            return rrE.destroy();
                        } else {
                            throw error;
                        }
                    }
                }
                
            })

        });
    },
};