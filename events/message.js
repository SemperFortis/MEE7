require("dotenv").config();
const Discord = require("discord.js");
const db = require("../util/db.js");
const utils = require("../util/util.js");

module.exports = message => {
    const msg = message;
    const client = msg.client;
    const messageArray = msg.content.split(/ +/g);
    // eslint-disable-next-line no-undef
    const cmd = messageArray[0].slice(process.env.PREFIX.length);
    const args = messageArray.slice(1);
    const commandFile = client.commands.get(cmd) || client.commands.find((x) => x.config.alias.includes(cmd));
    // If the user is a bot or in dm ignore
    if (msg.author.bot || msg.channel.type == "dm") return;
    // Insert user if they are not already in the database
    utils.notFound(msg, client, msg.author);
    // Add xp when a user sends a message within xp intervals
    utils.xp(msg, client, msg.author);
    // If the message does not start with the prefix
    // eslint-disable-next-line no-undef
    if (!msg.content.startsWith(process.env.PREFIX)) return;
    try {
        // If file exists run the bot
        if (commandFile) commandFile.run(Discord, msg, client, args, db, utils);
    } catch (e) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Error Occurred")
            .setDescription(`\`\`\`${e}\`\`\`\n\`\`\`Timestamp: ${new Date(new Date().getTime()).toLocaleString()}\`\`\``)
            .setFooter(`${msg.guild.name} ${msg.guild.id} | ${msg.author.tag} ${msg.author.id}`);
        return client.channels.cache.get("579393249878474754").send(embed);
    }
};