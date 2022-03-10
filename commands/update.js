module.exports = {
    name: 'update',
    description: 'Fait un git pull sur la branch master',
    usage: [],
    permitted: (client, message) => {
        return client.owner_id == message.author.id;
    },
    execute: (message, args) => {
        message.channel.send('Commande désactivée pour le moment')
    },
};