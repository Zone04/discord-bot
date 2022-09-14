const NoReactionRoleError = require("../errors/NoReactionRoleError");

module.exports = {
    name: 'Role reaction add',
    event: 'messageReactionAdd',
    callback: async (reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the reaction:', error);
                return;
            }
        }
        if (reaction.message.partial) {
            try {
                await reaction.message.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        if (reaction.client.modules.has('ReactionRoleManager')) {
            try {
                let rr = await reaction.client.modules.get('ReactionRoleManager').search(reaction.message);
                rr.react(reaction, user);
            } catch (error) {
                if (!(error instanceof NoReactionRoleError)) {
                    throw error;
                }
            }
        }
    },
};