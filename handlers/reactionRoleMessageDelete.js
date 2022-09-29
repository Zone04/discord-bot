module.exports = {
    name: 'Role Reaction Delete Message',
    event: 'messageDelete',
    callback: async (message) => {
        if (message.client.modulesManager.modules.has('ReactionRoleManager')) {
            try {
                let rrMessages = await message.client.db.ReactionRoleMessage.findAll({where:{messageId:message.id}});
                await Promise.all(rrMessages.map(async rrM => {
                    await rrM.destroy(); console.log(`Deleted rrMessage ${rrM.id}`);
                }));
            } catch (error) {
                console.error(error);
            }
        }
    }
}