module.exports = client => {
    const d20 = require("d20");

    client.roll = async dice => {
        return d20.roll(dice)
    }

    client.clean = async (client, text) => {
        if (text && text.constructor.name == "Promise") text = await text;
        if (typeof evaled !== "string")
            text = require("util").inspect(text, {
                depth: 1
            });

        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(
                client.token,
                "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
            );

        return text;
    };

    client.getUserFromMention = function getUserFromMention(mention) {
        if (!mention) return;
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
            return client.users.cache.get(mention);
        }

    }

    client.wait = require("util").promisify(setTimeout);

    process.on("uncaughtException", err => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        console.error(`Uncaught Exception: ${errorMsg}`);
        // Always best practice to let the code crash on uncaught exceptions.
        // Because you should be catching them anyway.
        process.exit(1);
    });

    process.on("unhandledRejection", err => {
        console.error(`Unhandled rejection: ${err}`);
    });
};