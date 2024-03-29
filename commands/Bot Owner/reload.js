const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reload',
    description: 'Rafraichit une partie du bot',
    usage: [
        {
            name: 'commands|config|cron|handlers|models|modules|utils',
            description: 'Partie à rafraichir',
            optional: false
        }
    ],
    check_args: (message, args) => {
        if (args.length != 1) return false;
        return ['commands', 'config', 'cron', 'handlers', 'models', 'modules', 'utils'].includes(args[0]);
    },
    permitted: (client, message) => {
        return client.config.owner_id == message.author.id;
    },
    execute: (message, args) => {
        if (args[0] == 'commands') {
            message.client.commandsManager.reload();
            return message.reply('Commandes rafraichies !')
        }
        if (args[0] == 'config') {
            delete require.cache[require.resolve('../../config.json')];
            message.client.config = require('../../config.json');
            return message.reply('Configuration rafraichie !');
        }
        if (args[0] == 'cron') {
            message.client.cronjobs.forEach(cronjob => {cronjob.stop(); delete cronjob;});
            message.client.cronjobs = new Array();
            delete require.cache[require.resolve('../../cron/index.js')];
            const cronScripts = require('../../cron/index.js');
            cronScripts.forEach(script => {
                console.log(`Starting cron job: ${script.name}`);
                message.client.cronjobs.push(cron.schedule(script.schedule, async() => { script.run(message.client) }));
            });
            return message.reply('Cron rafraichis !');
        }
        if (args[0] == 'handlers') {
            message.client.handlersManager.load();
            return message.reply('Handlers rafraichis !');
        }
        if (args[0] == 'models') {
            fs
            .readdirSync(__dirname + '/../../database/models/')
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                delete require.cache[require.resolve(path.join(__dirname + '/../../database/models/', file))];
                const model = require(path.join(__dirname + '/../../database/models/', file))(message.client.db.sequelize, message.client.db.Sequelize.DataTypes);
                message.client.db[model.name] = model;
            });

            Object.keys(message.client.db).forEach(modelName => {
            if (message.client.db[modelName].associate) {
                message.client.db[modelName].associate(message.client.db);
            }
            });

            message.reply('Modèles rafraichis !');
        }
        if (args[0] == 'modules') {
            message.client.modulesManager.load();
            return message.reply('Modules rafraichis !');
        }
        if (args[0] == 'utils') {
            delete require.cache[require.resolve('../../utils.js')];
            message.client.utils = require('../../utils.js');
            return message.reply('Utils rafraichis !');
        }
    },
};
