const { Op } = require("sequelize");

let settings = {
    name: 'user',
    description: 'Ajoute un utilisateur à la liste noire',
    usage: [
        {
            name: 'USERNAME|ID|MENTION|everyone|reset|view',
            description: 'Utilisateurs à ajouter/retirer. "everyone" pour ajouter tout le monde. "reset" pour effacer la liste. "view" ou vide pour voir la liste',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id;
    },
    check_args: (message, args) => {
        args = [...args]; // copy array
        if (args.includes('reset') || args.includes('view')) {
            return args.length == 1;
        }
        // other args should be users and will be checked for existence when executing
        return true;
    },
    execute: async (message, args) => {
        let client = message.client;
        if (args.includes('reset')) {
            // Erase the blacklist of current server
            await client.db.BlacklistUser.destroy({where: {guild_id: message.guild.id}});
            return message.reply(`Blacklist d'utilisateur effacée`);
        }
        if (args.includes('view') || args.length == 0) {
            let bl = await client.db.BlacklistUser.findAll({where: {guild_id: message.guild.id}});
            let reply = 'Liste des utilisateurs blacklistés :\n';
            if (bl.length == 0) {
                reply += '`Aucun utilisateur`';
            } else if (bl.some(entry => entry.user == 'everyone')) {
                if (bl.length == 1) {
                    reply += '`Tous les utilisateurs`'
                } else {
                    reply += '`Tous les utilisateurs`, ainsi que ';
                }
            }
            bl.filter(entry => entry.user != 'everyone').forEach(entry => {
                reply += `<@${entry.user}>`;
            });

            return message.channel.send({"content": reply,"allowedMentions": { "users" : []}});
        }

        // Here, there should only be users in arguments
        // Conversion into IDs, if not "everyone"
        let users = [];
        for (arg of args) {
            if (arg == 'everyone') {
                users.push('everyone');
            } else if (!isNaN(arg) && parseInt(arg) >= 0) {
                users.push(arg);
            } else {
                let guildMember;
                try {
                    guildMember = await client.utils.convertUser(message, arg);
                } catch(e) {
                    if (e instanceof UserNotFoundError || e instanceof TooManyUsersError) {
                        message.reply(e.message);
                        return;
                    } else {
                        throw e;
                    }
                }
                if (message.guild.ownerId == guildMember.user.id) {
                    return message.reply("Je ne peux ajouter le propriétaire du serveur à la blacklist");
                }
                users.push(guildMember.user.id);
            }
        }

        // Check all in or all not in blacklist
        let bl = await client.db.BlacklistUser.findAll({where: {guild_id: message.guild.id}});
        bl = bl.map(entry => entry.user);
        let allPresent = users.every(user => bl.includes(user));
        let allAbsent = users.every(user => !bl.includes(user));

        if (allAbsent) {
            let toCreate = [];
            for (user of users) {
                toCreate.push({guild_id: message.guild.id, user: user});
            }
            await client.db.BlacklistUser.bulkCreate(toCreate);

            let reply = 'Utilisateur(s) ajouté(s) à la blacklist :\n';
            if (users.some(user => user == 'everyone')) {
                if (users.length == 1) {
                    reply += '`Tous les utilisateurs`'
                } else {
                    reply += '`Tous les utilisateurs`, ainsi que ';
                }
            }
            users.filter(user => user != 'everyone').forEach(user => {
                reply += `<@${user}>`;
            });
            return message.reply(reply);

        } else if (allPresent) {
            await client.db.BlacklistUser.destroy({
                where: {
                    guild_id: message.guild.id,
                    user: {
                        [Op.in]: users,
                    },
                }
            });
            let reply = 'Utilisateur(s) retiré(s) de la blacklist :\n';
            if (users.some(user => user == 'everyone')) {
                if (users.length == 1) {
                    reply += '`Tous les utilisateurs`'
                } else {
                    reply += '`Tous les utilisateurs`, ainsi que ';
                }
            }
            users.filter(user => user != 'everyone').forEach(user => {
                reply += `<@${user}>`;
            });
            return message.reply(reply);
        } else {
            return message.reply('Les utilisateurs doivent être tous présents ou tous absents.');
        }

    },
};