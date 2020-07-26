module.exports = {
	name: 'ping',
	description: 'Determine ping between command and reply',
	execute(message, args) {
        message.channel.send("Pinging...").then(m =>{
            console.log("then")
            var ping = m.createdTimestamp - message.createdTimestamp;

            m.edit(`**:ping_pong: Pong!**\n Le ping est de  \`${ping}ms\`. Temps d'exécution`);
        }).catch(error => {
            console.log("Erreur commande ping.");
            console.log(error);
        });
	},
};