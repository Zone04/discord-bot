'use strict';

const fs = require('fs');
const { Collection } = require('discord.js');
const path = require('path');

class CommandsManager {
    constructor() {
        this.commands = new Collection();
        this.load();
    }

    load() {
        fs.readdirSync(__dirname, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .forEach((dir) => {
                const commandFiles = fs.readdirSync(path.join(__dirname,`${dir}/`)).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    let command = require(`./${dir}/${file}`);
                    command.cat = dir;
                    this.commands.set(command.name, command);
                }
            }
        )
    };
}


module.exports = { CommandsManager: CommandsManager };