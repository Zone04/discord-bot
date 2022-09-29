module.exports = {
    name: 'Role Reaction Delete Channel',
    event: 'channelDelete',
    callback: async (channel) => {
        if (channel.client.modulesManager.modules.has('ReactionRoleManager')) {
            try {
                let rrMessages = await channel.client.db.ReactionRoleMessage.findAll({where:{chanId:channel.id}});
                await Promise.all(rrMessages.map(async rrM => {
                    await rrM.destroy(); console.log(`Deleted rrMessage ${rrM.id}`);
                }));
            } catch (error) {
                console.error(error);
            }
        };
    }
}