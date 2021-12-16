module.exports = {
    name: 'update',
    description: 'Fait un git pull sur la branch master',
    execute: async(message, args) => {
        await message.channel.send('Commande désactivée pour le moment')
    },
};