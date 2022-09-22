module.exports = {
    name: 'Role Reaction Delete Emoji',
    event: 'emojiDelete',
    callback: async (emoji) => {
        if (emoji.client.modules.has('ReactionRoleManager')) {
            try {
                let rrEmojis = await emoji.client.db.ReactionRoleEmoji.findAll({where:{emoji:emoji.id}});
                await Promise.all(rrEmojis.map(async rrE => {
                    await rrE.destroy(); console.log(`Deleted rrEmoji rrM ${rrE.rrId} role ${rrE.roleId} emoji ${rrE.emoji}`);
                }));
            } catch (error) {
                console.error(error);
            }
        }
    }
}