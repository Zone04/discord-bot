#!/usr/bin/env nodemon

const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { PassThrough } = require('stream');

const utils = require('./utils.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.author.bot) { return };
    if (message.channel.type !== 'text') {
        return message.reply('Je suis un bot. Je ne répondrais pas ici !')
    }
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        let reply = `Vous n'avez pas donné d'arguments, ${message.author} !`;

        if (command.usage) {
            reply += `\nL'utilisation correcte est: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Il y a eu une erreur dans l\'exécution de cette commande...');
}

});

client.login(token)
