module.exports = {
    name: 'update',
    description: 'Fait un git pull sur la branch master',
    execute(message, args) {
        const { exec } = require("child_process")
        message.channel.send('Mise à jour en cours.').then(m => {
            exec('git pull', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                if (stdout) {
                    console.log(`stdout: ${stdout}`);
                }
            });

        });
    },
};