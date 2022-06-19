const utils = require('../../utils.js');

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
        return message.guild.ownerId == message.author.id;
    },
    execute: async(message, args) => {
        
        let [setting, created] = await message.client.db.Setting.findOrCreate({where:{id: message.guild.id}});
        if (created) {
            await setting.reload();
        }

        if (args[0] === 'get') {
            if (args.length !== 2) {
                return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
            }
            if (!(args[1] in setting)) {
                return message.reply('Ce paramètre n\'a pas été trouvé.');
            }
            message.reply(`\`\`\`${setting[args[1]]}\`\`\``);

        } else if (args[0] === 'set') {
            if (args.length !== 3) {
                return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
            }
            if (!(args[1] in setting)) {
                return message.reply('Ce paramètre n\'a pas été trouvé.');
            }
            setting[args[1]] = args[2];
            await setting.save();
            message.reply(`\`\`\`Paramètre modifié\`\`\``);

        } else if (args[0] === 'list') {
            let settingsName = Object.keys(setting.dataValues).filter(key => !(['id', 'createdAt', 'updatedAt'].includes(key)));
            console.log(setting.dataValues);
            console.log(settingsName);
            let string = 'Liste des paramètres :\n```\n';
            settingsName.forEach(name => string += `${name}\n`);
            string += '```';
            console.log(string);

            return message.reply(string);

        } else {
            return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
        }            

    },
};