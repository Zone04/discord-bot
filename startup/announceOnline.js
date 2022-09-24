module.exports = {
    name: 'announceOnline',
    description: 'Announce on every logging Chan that we\'re online',
    run: async (client) => {
        client.guilds.cache.forEach(async guild => {
            client.utils.sendLogMessage(client, guild.id, 'I\'m back online!');
        });
    },
};