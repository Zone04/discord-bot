'use strict';

const fs = require('fs');
const { Collection } = require('discord.js');
const cron = require('node-cron');
const path = require('path');

class CommandsManager {
    constructor(client) {
        this.commands = new Collection();
        this._cron = new Array();
        this._client = client
        this.load();
    }

    load() {
        let commands = new Collection();
        fs.readdirSync(__dirname, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .forEach((dir) => {
                const commandDirents = fs.readdirSync(path.join(__dirname,`${dir}/`), { withFileTypes: true });
                for (const dirent of commandDirents) {
                    if (dirent.name.endsWith('.js')) {
                        let command = require(`./${dir}/${dirent.name}`);
                        command.cat = dir;
                        commands.set(command.name, command);
                        console.log(`Loaded command ${dir}/${dirent.name}`);
                    } else if (dirent.isDirectory()) {
                        let command = require(`./${dir}/${dirent.name}`);
                        command.cat = dir;
                        command.subcommands = new Collection();
                        const subcommandFiles = fs.readdirSync(path.join(__dirname,`${dir}/${dirent.name}/`));
                        for (const file of subcommandFiles) {
                            if (file == 'index.js') continue;
                            let subcommand = require(`./${dir}/${dirent.name}/${file}`);
                            subcommand.parent = command.name;
                            command.subcommands.set(subcommand.name, subcommand);
                            console.log(`Loaded subcommand ${dir}/${dirent.name}/${file}`);
                        }
                        commands.set(command.name, command);
                    }
                }
            }
        )
        this.commands = commands;
    };

    reload() {
        this.stopcron();

        fs.readdirSync(__dirname, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .forEach((dir) => {
            const commandDirents = fs.readdirSync(path.join(__dirname,`${dir}/`), { withFileTypes: true });
            for (const dirent of commandDirents) {
                if (dirent.name.endsWith('.js')) {
                    delete require.cache[require.resolve(`./${dir}/${dirent.name}`)];
                } else if (dirent.isDirectory()) {
                    const subcommandFiles = fs.readdirSync(path.join(__dirname,`${dir}/${dirent.name}/`));
                    for (const file of subcommandFiles) {
                        delete require.cache[require.resolve(`./${dir}/${dirent.name}/${file}`)];
                    }
                }
            }
        });
        try {
            this.load();
        } finally {
            this.startcron();
        }
    }

    startup() {
        this.commands.forEach(command => {
            if (command.startup) {
                console.log(`Executing command startup script: ${command.name}`);
                command.startup(this._client);
            }
        });
    }

    startcron() {
        this.commands.forEach(command => {
            if (command.cron) {
                command.cron.forEach(cronJob => {
                    console.log(`Starting cron job for ${command.name}`);
                    this._cron.push(cron.schedule(cronJob.schedule, async () => { cronJob.run(this._client) }));
                })
            }
            if (command.subcommands) {
                command.subcommands.forEach(command => {
                    if (command.cron) {
                        command.cron.forEach(cronJob => {
                            console.log(`Starting cron job for ${command.parent} ${command.name}`);
                            this._cron.push(cron.schedule(cronJob.schedule, async () => { cronJob.run(this._client) }));
                        })
                    }
                })
            }
        });
    }

    stopcron() {
        this._cron.forEach(cronjob => {cronjob.stop();});
        this._cron = new Array();
    }
}


module.exports = { CommandsManager: CommandsManager };