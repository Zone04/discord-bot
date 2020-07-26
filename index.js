const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content === `${config.prefix}ping`) {
        message.channel.send("Pinging...").then(m =>{
            console.log("then")
            var ping = m.createdTimestamp - message.createdTimestamp;

            m.edit(`**:ping_pong: Pong!**\n Le ping est de  \`${ping}ms\`. Temps d'exécution`);
        }).catch(error => {
            console.log("Erreur commande ping.");
            console.log(error);
        });
    }
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content === '.pong') {
        message.channel.send('Ping MDR');
    }
});

client.login(config.token)
