const { MongoDelete: del } = require("../util/db.js");

module.exports = guild => {
    del("guilds", { id: guild.id })
}
