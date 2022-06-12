let settings = {
    name: 'user',
    description: 'Ajoute un utilisateur à la liste noire',
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
        message.channel.send('BL USER');
    },
};