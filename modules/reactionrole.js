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

    async addReaction(reaction, role) {
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        let rrE = await this._message.createReactionRoleEmoji({emoji: emoji, roleId: role});
        this._reactions.set(emoji, rrE);
    }

    async removeReaction(role) {
        let rrEs = await this._message.getReactionRoleEmojis({where: {roleId: role}});
        await Promise.all(rrEs.map(rrE => rrE.destroy()));
        this._reactions.filter(r => r.roleId == role).map((r,k) => this._reactions.delete(k));
    }

    async react(reaction, user) {
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        if (reaction.message.id == this._message.messageId && this._reactions.has(emoji)) {
            let member = await reaction.message.guild.members.fetch(user.id);
            member.roles.add(this._reactions.get(emoji).roleId);
        }
    }

    async unreact(reaction, user) {
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        if (reaction.message.id == this._message.messageId && this._reactions.has(emoji)) {
            let member = await reaction.message.guild.members.fetch(user.id);
            member.roles.remove(this._reactions.get(emoji).roleId);
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