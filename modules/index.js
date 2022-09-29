'use strict';

const fs = require('fs');
const { Collection } = require('discord.js');
const path = require('path');
const basename = path.basename(__filename);

class ModulesManager {
    constructor(client) {
        this.modules = new Collection();
        this._client = client;
        this.load();
    }

    load() {
        let modules = new Collection();
        fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            delete require.cache[require.resolve(path.join(__dirname, file))];
            const module = require(path.join(__dirname, file));
            for (let name in module) {
                modules.set(name, new module[name](this._client));
                console.log(`Loaded module ${name}`);
            }
        });

        this.modules = modules;

    };
}


module.exports = { ModulesManager: ModulesManager };