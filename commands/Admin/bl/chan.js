let settings = {
    name: 'chan',
    description: 'Ajoute un chan à la liste noire',
    usage: [],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: (message, args) => {
        message.channel.send('BL CHAN');
    },
};