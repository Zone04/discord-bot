let settings = {
    name: 'settings',
    description: 'Voir/Modifier un paramètre spécifique au serveur',
    usage: [
        {
            name: 'get|set|list',
            description: 'Action',
            optional: false
        },
        {
            name: 'SETTING',
            description: 'Paramètre à voir/modifier',
            optional: true
        },
        {
            name: 'VALUE',
            description: 'Nouvelle valeur du paramètre',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    check_args: (message, args) => {
        if (args.length == 0) {
            return false;
        }
        if (args[0] == 'list') {
            return args.length == 1;
        }
        if (args[0] == 'get') {
            return args.length == 2;
        }
        if (args[0] == 'set') {
            return args.length == 3;
        }
        return false;
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return message.guild.ownerId == message.author.id || message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    },
    execute: async(message, args) => {
        
        let [setting, created] = await message.client.db.Setting.findOrCreate({where:{id: message.guild.id}});
        if (created) {
            await setting.reload();
        }

        if (args[0] === 'get') {
            if (!(args[1] in setting)) {
                return message.reply('Ce paramètre n\'a pas été trouvé.');
            }
            message.reply(`\`\`\`${setting[args[1]]}\`\`\``);

        } else if (args[0] === 'set') {
            if (!(args[1] in setting)) {
                return message.reply('Ce paramètre n\'a pas été trouvé.');
            }
            setting[args[1]] = args[2];
            await setting.save();
            message.reply(`\`\`\`Paramètre modifié\`\`\``);

        } else if (args[0] === 'list') {
            let attributes = message.client.db.Setting.attributes;
            let settingsCategories = Object.keys(attributes);
            let string = 'Liste des paramètres :\n```\n';
            settingsCategories.sort().forEach(name => {
                string += `\n${name}:\n`;
                Object.keys(attributes[name]).sort().forEach(s =>{
                    string += `${s.concat(' ').padEnd(14, ' ')}- ${attributes[name][s].description}\n`;
                });
            });
            string += '```';

            return message.reply(string);

        }         

    },
};