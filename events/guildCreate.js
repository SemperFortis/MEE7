const { MongoFind: find, MongoInsert: insert } = require("../util/db.js");

module.exports = guild => {
    find("guilds", { id: guild.id }).then((server) => {
        if (!server.length) {
            // Insert new guild into the database
            insert("guilds", {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL(),
                owner: guild.ownerID,
                dateAdded: Date.now(),
                settings: {
                    roles: [],
                    xpInt: 120000,
                    lvlMsgs: true
                },
                users: []
            });
        }
    });
};