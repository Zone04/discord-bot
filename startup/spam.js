module.exports = {
    name: 'spam',
    execute: async (client) => {
        const spams = await client.db.Spam.findAll();
        spams.forEach(spam => {
            console.log('Found spam');
            console.log(`${spam.source} spammed ${spam.target}, ${spam.progress} out of ${spam.number} in ${spam.channel}`);
        });
    }
};