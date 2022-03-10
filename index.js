#!/usr/bin/env nodemon

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { prefix, token, owner_id } = require('./config.json');
const startupScripts = require('./startup/index.js');
const cronScripts = require('./cron/index.js')
const db = require('./database/index.js');
const cron = require('node-cron');

const utils = require('./utils.js');

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES
], partials: ['CHANNEL'] });
client.commands = new Collection();
client.prefix = prefix;
client.owner_id = owner_id;
client.db = db;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    startupScripts.forEach(script => {
        console.log(`Executing startup script: ${script.name}`);
        script.execute(client);
    });
    client.commands.forEach(command => {
        if (command.startup) {
            console.log(`Executing command startup script: ${command.name}`);
            command.startup(client);
        }
    });
    cronScripts.forEach(script => {
        console.log(`Starting cron job: ${script.name}`);
        cron.schedule(script.schedule, async() => { script.run(client) });
    });
    client.commands.forEach(command => {
        if (command.cron) {
            command.cron.forEach(cronJob => {
                console.log(`Starting cron job for ${command.name}`);
                cron.schedule(cronJob.schedule, async () => { cronJob.run(client) });
            })
        }
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) { return };
    // Tell no response if DM channel
    if (message.channel.type === 'DM') {
        return message.reply({ content: 'Je suis un bot. Je ne répondrais pas ici !', allowedMentions: { repliedUser: false }})
    }
    // Ignore all channels that are not guild text or thread
    if (!(['GUILD_TEXT','GUILD_PUBLIC_THREAD','GUILD_PRIVATE_THREAD'].includes(message.channel.type))) return;
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content.slice(client.prefix.length).replace(/ +$/,'').split(/ +/);
    const commandName = args.shift();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        reply = utils.getHelpMessage(client, command);

        return message.reply(reply);
    }

    if (command.permitted(client, message)) {
        try {
            await command.execute(message, args)
        } catch(error) {
            console.error(error);
            message.reply(`Uh Oh... Une erreur est survenue !`).catch(_ => {});
        }
    }
});

db.sequelize.authenticate().then(_ => {
    console.log('Connection to the database has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
});

client.login(token).catch(error => {
    console.error(error);
    process.exit(1);
})
