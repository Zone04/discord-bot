#!/usr/bin/env nodemon

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { CommandsManager } = require('./commands');
const { HandlersManager } = require('./handlers');
const { ModulesManager } = require('./modules');
const config = require('./config.json');
const startupScripts = require('./startup');
const cronScripts = require('./cron')
const db = require('./database');
const cron = require('node-cron');
const snoowrap = require('snoowrap');

const utils = require('./utils.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
], partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User] });
client.cronjobs = new Array();
client.config = config;
client.db = db;
client.utils = utils;

client.modulesManager = new ModulesManager(client);
client.commandsManager = new CommandsManager(client);
client.handlersManager = new HandlersManager(client);

client.r = new snoowrap({
  userAgent: client.config.userAgent,
  clientId: client.config.clientId,
  clientSecret: client.config.clientSecret,
  refreshToken: client.config.refreshToken
});

client.once('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    startupScripts.forEach(script => {
        console.log(`Executing startup script: ${script.name}`);
        script.run(client);
    });
    cronScripts.forEach(script => {
        console.log(`Starting cron job: ${script.name}`);
        client.cronjobs.push(cron.schedule(script.schedule, async() => { script.run(client) }));
    });
    client.commandsManager.startup(client);
    client.commandsManager.startcron(client);
});

db.sequelize.authenticate().then(_ => {
    console.log('Connection to the database has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
});

client.login(client.config.token).catch(error => {
    console.error(error);
    process.exit(1);
})
