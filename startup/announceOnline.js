module.exports = {
    name: 'announceOnline',
    description: 'Announce on every logging Chan that we\'re online',
    run: async (client) => {
        client.guilds.cache.forEach(async guild => {
            let [setting, created] = await client.db.Setting.findOrCreate({where:{id: guild.id}});
            if (created) {
                await setting.reload();
            }
            if (!setting.logChan) return;

            let chan = client.channels.cache.get(setting.logChan);
            chan.send('I\'m back online!').catch();
        });
    },
};