const { execSync } = require('child_process');

module.exports = {
    name: 'update',
    description: 'Fait un git fetch sur la branche master puis checkout sur le dernier tag',
    usage: [],
    permitted: (client, message) => {
        return client.config.owner_id == message.author.id;
    },
    execute: async (message, args) => {
        let msg = await message.channel.send('Running git fetch');
        console.log('Running git fetch --tags');
        console.log(execSync('git fetch --tags').toString());
        msg = await msg.edit(msg.content + '\nGit fetch done');
        let commit = execSync('git rev-list --tags --max-count=1').toString();
        let version = execSync(`git describe --tags ${commit}`).toString();
        msg = await msg.edit(msg.content + '\nLatest version: ' + version);
        console.log('Running git checkout');
        console.log(execSync(`git checkout ${version}`).toString());
        msg = await msg.edit(msg.content + '\nRunning npm install');
        console.log('Running npm install');
        console.log(execSync(`npm install`).toString());
        msg = await msg.edit(msg.content + '\nnpm install done');
        msg = await msg.edit(msg.content + '\nRunning migrations');
        console.log(execSync(`cd database && npx sequelize-cli db:migrate`));
        msg = await msg.edit(msg.content + '\nVersion updated. Ready to reboot.');
    },
};