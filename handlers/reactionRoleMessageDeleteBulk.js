module.exports = {
    name: 'Role Reaction Delete Message Bulk',
    event: 'messageDeleteBulk',
    callback: async (messages, channel) => {
        if (messages.first()?.client.modulesManager.modules.has('ReactionRoleManager')) {
            messages.forEach(async message => {
                try {
                    let rrMessages = await message.client.db.ReactionRoleMessage.findAll({where:{messageId:message.id}});
                    await Promise.all(rrMessages.map(async rrM => {
                        await rrM.destroy(); console.log(`Deleted rrMessage ${rrM.id}`);
                    }));
                } catch (error) {
                    console.error(error);
                }
            }
        )};
    }
}