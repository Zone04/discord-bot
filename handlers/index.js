'use strict';

const fs = require('fs');
const { Collection } = require('discord.js');
const path = require('path');
const basename = path.basename(__filename);

class HandlersManager {
    constructor(client) {
        this.handlers = new Collection();
        this._client = client;
        this.load();
    }

    load() {
        let handlers = new Collection();
        fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            delete require.cache[require.resolve(path.join(__dirname, file))];
            const handler = require(path.join(__dirname, file));
            handlers.set(handler.name, handler);
        });

        for (let [name, handler] of this.handlers) {
            this._client.removeListener(handler.event, handler.callback);
            console.log(`Removed handler ${name}`);
        }
        this.handlers = handlers;
        for (let [name, handler] of this.handlers) {
            this._client.on(handler.event, handler.callback);
            console.log(`Added handler ${name}`);
        }

    };
}


module.exports = { HandlersManager: HandlersManager };