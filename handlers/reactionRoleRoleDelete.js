module.exports = {
    name: 'Role Reaction Delete Role',
    event: 'roleDelete',
    callback: async (role) => {
        if (role.client.modulesManager.modules.has('ReactionRoleManager')) {
            try {
                let rrEmojis = await role.client.db.ReactionRoleEmoji.findAll({where:{roleId:role.id}});
                await Promise.all(rrEmojis.map(async rrE => {
                    await rrE.destroy(); console.log(`Deleted rrEmoji rrM ${rrE.rrId} role ${rrE.roleId} emoji ${rrE.emoji}`);
                }));
            } catch (error) {
                console.error(error);
            }
        }
    }
}