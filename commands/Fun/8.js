const utils = require('../../utils.js');

let settings = {
    name: '8',
    description: 'Pose une question à la boule magique',
    usage: [
        {
            name: 'QUESTION',
            description: 'Question à poser',
            optional: false
        }
    ],
}

module.exports = {
    name: settings.name,
    description: settings.description,
    check_args: (message, args) => {
        return args.length >= 1;
    },
    usage: settings.usage,
    permitted: (client, message) => {
        return true;
    },
    execute: async(message, args) => {
        let question = args.join(' ');

        if (question.length == 1 || question[question.length - 1] != '?') {
            return message.reply("Pose-moi une question, et seulement là je pourrais y répondre.");
        }
        let answers = [
            'C\'est certain',
            'C\'est décidément ainsi',
            'Sans aucun doute',
            'Définitivement oui',
            'Vous pouvez compter là-dessus',
            'Comme je le vois, oui',
            'Très certainement',
            'Les perspectives sont bonnes',
            'Oui',
            'Les signes indiquent que oui',
            'Réponse floue... essayez encore',
            'Demandez à nouveau plus tard',
            'Mieux vaut ne pas répondre maintenant',
            'Je ne peux pas le dire maintenant',
            'Concentrez-vous, et demandez encore',
            'Ne comptez pas là-dessus',
            'Ma réponse est non',
            'Mes sources disent non',
            'Les perspectives ne sont pas bonnes',
            'J\'en doute fort'
        ];

        let reply = answers[Math.floor(Math.random()*answers.length)];
        return message.reply(reply);
    },
};