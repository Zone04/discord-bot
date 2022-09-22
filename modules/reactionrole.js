'use strict';

const { Collection, PermissionsBitField } = require('discord.js');
const MissingPermissionError = require('../errors/MissingPermissionError');
const NoReactionRoleError = require('../errors/NoReactionRoleError');
const RoleNotFoundError = require('../errors/RoleNotFoundError');
const UnassignableRoleError = require('../errors/UnassignableRoleError');

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

    async addReaction(reaction, roleId) {
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        let guild = reaction.message.guild;
        let role = await guild.roles.fetch(roleId);
        if (role == null) {throw new RoleNotFoundError('Error fetching role')}
        if (role.managed) {throw new UnassignableRoleError('Role managed by an external service')}
        if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high')}
        let message = await this._client.channels.cache.get(this._message.chanId).messages.fetch(this._message.messageId);
        let rrE = await this._message.createReactionRoleEmoji({emoji: emoji, roleId: roleId});
        await message.react(emoji);
        this._reactions.set(emoji, rrE);
    }

    async removeReaction(role) {
        let rrEs = await this._message.getReactionRoleEmojis({where: {roleId: role}});
        await Promise.all(rrEs.map(rrE => rrE.destroy()));
        this._reactions.filter(r => r.roleId == role).map((r,k) => this._reactions.delete(k));
    }

    async react(reaction, user) {
        let guild = reaction.message.guild;
        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {throw new MissingPermissionError('Not enough permission')}
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        if (reaction.message.id == this._message.messageId && this._reactions.has(emoji)) {
            let member = await reaction.message.guild.members.fetch(user.id);
            if (this._message.type == 'single') {
                await Promise.all(this._reactions.map(async rrEmoji => {
                    let role = await guild.roles.fetch(rrEmoji.roleId);
                    if (role == null) {throw new RoleNotFoundError('Error fetching role')}
                    if (role.managed) {throw new UnassignableRoleError('Role managed by an external service')}
                    if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high')}
                    if (rrEmoji.emoji == emoji) {
                        return member.roles.add(rrEmoji.roleId);
                    }
                    return Promise.all([member.roles.remove(rrEmoji.roleId), reaction.message.reactions.resolve(rrEmoji.emoji)?.users.remove(user)]);
                }));
            }
            if (this._message.type == 'multiple') {
                let role = await guild.roles.fetch(this._reactions.get(emoji).roleId);
                if (role == null) {throw new RoleNotFoundError('Error fetching role')}
                if (role.managed) {throw new UnassignableRoleError('Role managed by an external service')}
                if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high')}
                await member.roles.add(role.id);
            }
        }
    }

    async unreact(reaction, user) {
        let guild = reaction.message.guild;
        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {throw new MissingPermissionError('Not enough permission')}
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        if (reaction.message.id == this._message.messageId && this._reactions.has(emoji)) {
            let role = await guild.roles.fetch(this._reactions.get(emoji).roleId);
            if (role == null) {throw new RoleNotFoundError('Error fetching role')}
            if (role.managed) {throw new UnassignableRoleError('Role managed by an external service')}
            if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high')}
            let member = await reaction.message.guild.members.fetch(user.id);
            await member.roles.remove(role.id);
        }
    }

    async createReact() {
        let message = await this._client.channels.cache.get(this._message.chanId).messages.fetch(this._message.messageId);
        await Promise.all(this._reactions.map(rrEmoji => message.react(rrEmoji.emoji)));
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