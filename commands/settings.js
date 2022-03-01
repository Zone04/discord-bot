const utils = require('../utils.js');

let settings = {
    name: 'settings',
    description: 'Voir/Modifier un paramètre spécifique au serveur',
    args: false,
    usage: [
        {
            name: 'get|set|list',
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
    args: settings.args,
    usage: settings.usage,
    execute: async(message, args) => {

        if (message.guild.ownerId !== message.author.id) return;
        
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
            await setting.update({[args[1]]: args[2]});
            message.reply(`\`\`\`Paramètre modifié\`\`\``);
        } else if (args[0] === 'list') {
            let settingsName = Object.keys(setting.dataValues).filter(key => !(['id', 'createdAt', 'updatedAt'].includes(key)));
            let string = 'Liste des paramètres :\n```';
            settingsName.forEach(name => string += `${name}\n`);
            string += '```';

            return message.reply(string);

        } else {
            return message.reply(utils.getHelpMessage(message.client, message.client.commands.get(settings.name)));
        }            

    },
};