let settings = {
    name: 'roll',
    description: 'Tire un nombre aléatoire',
    usage: [
        {
            name: 'LIMITE',
            description: 'Nombre maximal - défaut 100',
            optional: true
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    check_args: (message, args) => {
        if (args.length == 0) { return true; }
        return args.length == 1 && !isNaN(args[0]) && parseInt(args[0]) >= 2
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
        let limit = 100;
        if (args.length == 1) {
            limit = parseInt(args[0]);
        }

        message.reply(`Dé à ${limit} faces... Le résultat est ${Math.ceil(Math.random()*limit)} !`);
    },
};