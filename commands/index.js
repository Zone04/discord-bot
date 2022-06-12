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
        this.commands = new Collection();
        fs.readdirSync(__dirname, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .forEach((dir) => {
                const commandFiles = fs.readdirSync(path.join(__dirname,`${dir}/`)).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    let command = require(`./${dir}/${file}`);
                    command.cat = dir;
                    this.commands.set(command.name, command);
                    console.log(`Loaded command ${dir}/${file}`)
                }
            }
        )
    };

    reload() {
        this.stopcron();

        fs.readdirSync(__dirname, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
            .forEach((dir) => {
            const commandFiles = fs.readdirSync(path.join(__dirname,`${dir}/`)).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`./${dir}/${file}`)];
            }
        });
        this.load();
        this.startcron();
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
        });
    }

    stopcron() {
        this._cron.forEach(cronjob => {cronjob.stop();});
        this._cron = new Array();
    }
}


module.exports = { CommandsManager: CommandsManager };