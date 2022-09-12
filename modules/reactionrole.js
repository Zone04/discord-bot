'use strict';

const { Collection } = require('discord.js');
const NoReactionRoleError = require('../errors/NoReactionRoleError.js');

class ReactionRole {
    constructor(client, reactionrolemessage, reactionrolereactions) {
        this._client = client;
        this._message = reactionrolemessage;
        this._type = reactionrolemessage.type;
        this._reactions = new Collection();
        for (const rrEmoji of reactionrolereactions) {
            this._reactions.set(rrEmoji.emoji, rrEmoji);
        }
    }

    addReaction(reaction, role) {
        this._reactions.set(reaction, role);
    }

    removeReaction(role) {
        this._reactions.delete(this._reactions.filter(r => r == role).firstKey());
    }

    async react(reaction, user) {
        if (reaction.message.id == this._message.messageId && this._reactions.has(reaction.emoji.id)) {
            let member = await reaction.message.guild.members.fetch(user.id);
            member.roles.add(this._reactions.get(reaction.emoji.id).roleId);
        }
    }

    async unreact(reaction, user) {
        if (reaction.message.id == this._message.messageId && this._reactions.has(reaction.emoji.id)) {
            let member = await reaction.message.guild.members.fetch(user.id);
            member.roles.remove(this._reactions.get(reaction.emoji.id).roleId);
        }
    }
}

class ReactionRoleManager {
    constructor(client) {
        this._client = client;
    }

    async search(message) {
        const rrMessage = await this._client.db.ReactionRoleMessage.findOne({
            where: {
                chanId: message.channel.id,
                messageId: message.id,
            }
        });
        if (rrMessage == null) {
            throw new NoReactionRoleError('Pas de ReactionRole trouvé pour ce message');
        } else {
            const rrEmojis = await rrMessage.getReactionRoleEmojis();
            return new ReactionRole(this._client, rrMessage, rrEmojis);
        }
    }

    async create(message, type) {
        const rrMessage = await this._client.db.ReactionRoleMessage.create({ chanId: message.channel.id, messageId: message.id, type: type });
        const rrEmojis = await rrMessage.getReactionRoleEmojis();
        return new ReactionRole(this._client, rrMessage, rrEmojis);
    }

    async delete(message) {
        const rrMessage = this.search(message);
        await rrMessage.destroy();
    }
}


module.exports = { ReactionRole: ReactionRole, ReactionRoleManager: ReactionRoleManager };