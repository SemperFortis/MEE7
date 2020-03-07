const { MongoFind: find, MongoUpdate: update } = require("../util/db.js");

/**
 * @function notFound
 * @param {Event} msg The message event
 * @param {Client} client The bot client
 * @param {Object} player The user to check if they are in the database
 * @example notFound(msg, client, player)
 */
module.exports.notFound = (msg, client, player) => {
    find("guilds", { id: msg.guild.id }).then(server => {
        const newUser = {
            id: player.id,
            username: player.username,
            icon: player.displayAvatarURL(),
            dateAdded: new Date(new Date().getTime()).toLocaleString(),
            lastSeen: Date.now(),
            level: 0,
            xp: 0,
            reqXp: 100,
            lifetimeXp: 0,
            messages: 0,
            profile: {
                background: "",
                color: `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`
            }
        };
        let found = false;
        for (const entry of server[0].users) {
            if (entry.id == player.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            server[0].users.push(newUser);
            update("guilds", { id: msg.guild.id }, { "users": server[0].users });
            const key = ["rank", "level", "lvl"];
            for (const flag of key) {
                if (msg.content == `!${flag}`) {
                    msg.reply("You are not ranked yet. Send some messages, then try again.");
                    break;
                }
            }
            return;
        }
    });
};

/**
 * @function xp
 * @param {Event} msg The message event
 * @param {Client} client The bot client
 * @param {Object} player The user to update the xp for in the database
 * @example xp(msg, client, player)
 */
module.exports.xp = (msg, client, player) => {
    find("guilds", { id: msg.guild.id }).then(server => {
        // Update any new information
        if (server.name != msg.guild.name || server.icon != msg.guild.iconURL() || server.ownerID != msg.guild.ownerID) {
            update("guilds", { id: msg.guild.id }, { "name": msg.guild.name, "icon": msg.guild.iconURL(), "owner": msg.guild.ownerID });
        }
        server[0].users.map(x => {
            if (x.id == player.id) {
                if (Date.now() - x.lastSeen >= server[0].settings.xpInt) {
                    let xpEarned = Math.floor(Math.random() * (25 - 15 + 1) + 15);
                    // If the user has ranked up a level (incremenet the level by 1, reset xp for the new level and specify a new xp threshold)
                    x.username = player.username;
                    x.icon = player.displayAvatarURL();
                    x.lastSeen = Date.now();
                    x.lifetimeXp += xpEarned;
                    x.xp += xpEarned;
                    x.messages += 1;
                    if (x.reqXp - x.xp < xpEarned) {
                        x.level += 1;
                        x.xp = 0;
                        x.reqXp = 5 / 6 * (x.level + 1) * (2 * Math.pow(x.level + 1, 2) + 27 * (x.level + 1) + 91);
                        msg.channel.send(`Congratulations <@${player.id}>, you advanced to level ${x.level}!`);
                    }
                    update("guilds", { id: msg.guild.id }, { "users": server[0].users });
                    return;
                }
            }
        });
    });
};

/**
 * @function checkPerms
 * 
 */
module.exports.checkPerms = () => {
    //
};