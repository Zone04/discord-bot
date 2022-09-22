const MissingPermissionError = require("../errors/MissingPermissionError");
const NoReactionRoleError = require("../errors/NoReactionRoleError");
const RoleNotFoundError = require("../errors/RoleNotFoundError");
const UnassignableRoleError = require("../errors/UnassignableRoleError");

module.exports = {
    name: 'Role reaction add',
    event: 'messageReactionAdd',
    callback: async (reaction, user) => {
        if (user.partial) {
            try {
                await user.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the user:', error);
                return;
            }
        }
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

        if (user.bot) return;
        if (reaction.client.modules.has('ReactionRoleManager')) {
            try {
                let rr = await reaction.client.modules.get('ReactionRoleManager').search(reaction.message);
                rr.react(reaction, user);
            } catch (error) {
                if (error instanceof NoReactionRoleError) {}
                else if (error instanceof UnassignableRoleError) {
                    console.error(error);
                    // Send message to admin log chan
                } else if (error instanceof RoleNotFoundError) {
                    console.error(error);
                    // Send message to admin log chan
                } else if (error instanceof MissingPermissionError) {
                    console.error(error)
                    // Send message to admin log chan
                } else {
                    console.error(error);
                }
            }
        }
    },
};