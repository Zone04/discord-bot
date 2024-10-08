'use strict';

const { Collection, PermissionsBitField, DiscordAPIError } = require('discord.js');
const MissingPermissionError = require('../errors/MissingPermissionError');
const NoReactionRoleError = require('../errors/NoReactionRoleError');
const ReactionRoleDuplicateError = require('../errors/ReactionRoleDuplicateError');
const RoleNotFoundError = require('../errors/RoleNotFoundError');
const RRIgnoreUserError = require('../errors/RRIgnoreUserError');
const TooManyReactionsError = require('../errors/TooManyReactionsError');
const UnassignableRoleError = require('../errors/UnassignableRoleError');

class ReactionRole {
    constructor(client, reactionrolemessage, reactionrolereactions, reactionroleignores) {
        this._client = client;
        this._message = reactionrolemessage;
        this._type = reactionrolemessage.type;
        this._reactions = new Collection();
        for (const rrEmoji of reactionrolereactions) {
            this._reactions.set(rrEmoji.emoji, rrEmoji);
        }
        this._ignores = new Collection();
        for (const rrIgnore of reactionroleignores) {
            this._ignores.set(rrIgnore.userId, rrIgnore);
        }
    }

    async addIgnore(userId) {
        if (!this._ignores.has(userId)) {
            let rrI = await this._message.createReactionRoleIgnore({userId: userId});
            this._ignores.set(userId, rrI);
        } else {
            throw new RRIgnoreUserError('User already ignored');
        }
    }

    async removeIgnore(userId) {
        if (this._ignores.has(userId)) {
            let rrI = this._ignores.get(userId);
            await rrI.destroy();
            this._ignores.delete(userId);
        } else {
            throw new RRIgnoreUserError('User not ignored');
        }
    }

    async addReaction(emoji, roleId, guild) {
        if (this._reactions.size >= 20) {
            throw new TooManyReactionsError('Too many roles are registered for this message');
        }
        let role = await guild.roles.fetch(roleId);
        if (role == null) {throw new RoleNotFoundError('Error fetching role', roleId)}
        if (role.managed) {throw new UnassignableRoleError('Role managed by an external service', role)}
        if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high', role)}
        let message = await this._client.channels.cache.get(this._message.chanId).messages.fetch(this._message.messageId);
        let rrE = await this._message.createReactionRoleEmoji({emoji: emoji, roleId: roleId});
        if (!guild.members.me.permissionsIn(this._message.chanId).has(PermissionsBitField.Flags.AddReactions)) {
            throw new MissingPermissionError('Cannot add reactions');
        }
        try {
            await message.react(emoji);
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code == 30010) {
                throw new TooManyReactionsError('Unable to add the reaction to the message. Try removing all reactions and recreate them.');
            } else {
                throw error;
            }
        }
        this._reactions.set(emoji, rrE);
    }

    async removeReaction(role) {
        let rrEs = await this._message.getReactionRoleEmojis({where: {roleId: role}});
        await Promise.all(rrEs.map(rrE => rrE.destroy()));
        this._reactions.filter(r => r.roleId == role).map((r,k) => this._reactions.delete(k));
    }

    async react(reaction, user) {
        if (this._ignores.has(user.id)) return;

        let guild = reaction.message.guild;
        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {throw new MissingPermissionError('Not enough permission')}
        let emoji;
        if (reaction.emoji.id != null) {
            emoji = reaction.emoji.id;
        } else {
            emoji = reaction.emoji.name;
        }
        if (reaction.message.id == this._message.messageId && this._reactions.has(emoji)) {
            let member = await guild.members.fetch(user.id);
            if (this._message.type == 'single') {
                let permManageMessage = guild.members.me.permissionsIn(this._message.chanId).has(PermissionsBitField.Flags.ManageMessages);
                if (!permManageMessage) {
                    this._client.utils.sendLogMessage(this._client, guild.id, `[REACTION ROLE] Missing ManageMessages Permission in <#${this._message.chanId}>. Cannot remove reactions`);
                }
                await Promise.all(this._reactions.map(async rrEmoji => {
                    let role = await guild.roles.fetch(rrEmoji.roleId);
                    if (role == null) {throw new RoleNotFoundError('Error fetching role', rrEmoji.roleId)}
                    if (role.managed) {throw new UnassignableRoleError('Role managed by an external service', role)}
                    if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high', role)}
                    if (rrEmoji.emoji == emoji) {
                        this._client.utils.sendLogMessage(this._client, guild.id, `[REACTION ROLE] User ${member.user} claimed role ${role}`);
                        return member.roles.add(rrEmoji.roleId);
                    }
                    return Promise.all(
                        [
                            (async ()=>{
                                if (member.roles.resolve(rrEmoji.roleId)) {
                                    this._client.utils.sendLogMessage(this._client, guild.id, `[REACTION ROLE] User ${member.user} removed role ${role}`);
                                    await member.roles.remove(rrEmoji.roleId);
                                }
                                if (permManageMessage) {
                                    await reaction.message.reactions.resolve(rrEmoji.emoji)?.users.remove(user);
                                }
                            })()
                        ]
                    );
                }));
            }
            if (this._message.type == 'multiple') {
                let role = await guild.roles.fetch(this._reactions.get(emoji).roleId);
                if (role == null) {throw new RoleNotFoundError('Error fetching role', this._reactions.get(emoji).roleId)}
                if (role.managed) {throw new UnassignableRoleError('Role managed by an external service', role)}
                if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high', role)}
                this._client.utils.sendLogMessage(this._client, guild.id, `[REACTION ROLE] User ${member.user} claimed role ${role}`);
                await member.roles.add(role.id);
            }
        }
    }

    async unreact(reaction, user) {
        if (this._ignores.has(user.id)) return;

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
            await Promise.all(this._reactions.map(async rrEmoji => {
                let role = await guild.roles.fetch(rrEmoji.roleId);
                if (role == null) {throw new RoleNotFoundError('Error fetching role', rrEmoji.roleId)}
                if (role.managed) {throw new UnassignableRoleError('Role managed by an external service', role)}
                if (role.comparePositionTo(guild.members.me.roles.highest) >= 0) {throw new UnassignableRoleError('Role position too high', role)}
                return Promise.all(
                    [
                        (async ()=>{
                            if (member.roles.resolve(rrEmoji.roleId) && (await (await reaction.message.reactions.resolve(rrEmoji.emoji))?.users.fetch({'after':user.id, 'limit':1})).length > 0) {
                                this._client.utils.sendLogMessage(this._client, guild.id, `[REACTION ROLE] User ${member.user} removed role ${role}`);
                                return member.roles.remove(rrEmoji.roleId);
                            }
                        })()
                    ]
                );
            }));
        }
    }

    async createReact() {
        if (!this._client.channels.cache.get(this._message.chanId).guild.members.me.permissionsIn(this._message.chanId).has(PermissionsBitField.Flags.AddReactions)) {
            throw new MissingPermissionError('Cannot add reactions');
        }
        let message = await this._client.channels.cache.get(this._message.chanId).messages.fetch(this._message.messageId);
        try {
            await Promise.all(this._reactions.map(rrEmoji => message.react(rrEmoji.emoji)));
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code == 30010) {
                throw new TooManyReactionsError('Unable to add the reaction to the message. Try removing all reactions and recreate them.');
            } else {
                throw error;
            }
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
            const rrIgnores = await rrMessage.getReactionRoleIgnores();
            return new ReactionRole(this._client, rrMessage, rrEmojis, rrIgnores);
        }
    }

    async create(message, type) {
        try {
            await this.search(message);
            throw new ReactionRoleDuplicateError('ReactionRoleMessage already existing');
        } catch (error) {
            if (!(error instanceof NoReactionRoleError)) {
                throw error;
            }
        }
        const rrMessage = await this._client.db.ReactionRoleMessage.create({ chanId: message.channel.id, messageId: message.id, type: type });
        const rrEmojis = await rrMessage.getReactionRoleEmojis();
        const rrIgnores = await rrMessage.getReactionRoleIgnores();
        return new ReactionRole(this._client, rrMessage, rrEmojis, rrIgnores);
    }

    async delete(message) {
        const rrMessage =  await this.search(message);
        await rrMessage._message.destroy();
    }
}


module.exports = { ReactionRoleManager: ReactionRoleManager };