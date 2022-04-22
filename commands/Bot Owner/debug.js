let settings = {
    name: 'debug',
    description: 'Commande de debug',
    args: false,
    usage: [
        {
            name: 'CODE',
            description: 'Code à exécuter',
            optional: false
        }
    ],
}

// This function cleans up and prepares the
// result of our eval command input for sending
// to the channel
const clean = async (client, text) => {
    // If our input is a promise, await it before continuing
    if (text && text.constructor.name == "Promise")
        text = await text;
    
    // If the response isn't a string, `util.inspect()`
    // is used to 'stringify' the code in a safe way that
    // won't error out on objects with circular references
    // (like Collections, for example)
    if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });
    
    // Replace symbols with character code alternatives
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

    text = text.replaceAll(client.token, "[REDACTED]");
    
    // Send off the cleaned up result
    return text.substring(0, 1900);
}

module.exports = {
    name: settings.name,
    description: settings.description,
    args: settings.args,
    usage: settings.usage,
    permitted: (client, message) => {
        return client.config.owner_id == message.author.id;
    },
    execute: async(message, args) => {
        try {
            const evaled = eval(args.join(" "));
            const cleaned = await clean(message.client, evaled);
        
            message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
            message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
        }
    },
};