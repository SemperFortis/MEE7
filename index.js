const Discord = require("discord.js");
const fs = require("fs");
const { MongoConnect: connect } = require("./util/db.js");
const client = new Discord.Client({ disableEveryone: true, fetchAllMembers: true, messageSweepInterval: 1800 });
require("./util/eventLoader.js")(client);

connect();
client.commands = new Discord.Collection();

fs.readdirSync("./src").forEach(dir => fs.readdirSync(`./src/${dir}`).forEach(file => {
    const pull = require(`./src/${dir}/${file}`);
    client.commands.set(pull.config.name, pull);
}));

client.login(process.env.TOKEN).catch(e => { throw new Error(e) } ) 