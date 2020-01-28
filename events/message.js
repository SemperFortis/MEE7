const Discord = require("discord.js");
const settings = require("../config.json");
const db = require("../util/db.js");
const utils = require("../util/util.js");

module.exports = message => {
    const msg = message;
    const client = msg.client;
    const messageArray = msg.content.split(/ +/g);
    const cmd = messageArray[0].slice(settings.client.prefix.length);
    const args = messageArray.slice(1);
    const commandFile = client.commands.get(cmd) || client.commands.find((x) => x.config.alias.includes(cmd));
    // If the user is a bot ignore
    if (msg.author.bot) return;
    // Insert user if they are not already in the database
    utils.notFound(msg, client, msg.author)
    // Add xp when a user sends a message within 2 minute intervals
    utils.xp(msg, client, msg.author);
    // If the message does not start with the prefix
    if (!msg.content.startsWith(settings.client.prefix)) return;
    try {
        // If file exists run the bot
        if (commandFile) commandFile.run(Discord, msg, client, args, db, utils);
    } catch (e) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Error Occurred")
            .setDescription(`\`\`\`${e}\`\`\`\n\`\`\`Timestamp: ${new Date(new Date().getTime()).toLocaleString()}\`\`\``)
            .setFooter(`${msg.guild.name} ${msg.guild.id} | ${msg.author.tag} ${msg.author.id}`)
        return client.channels.get("579393249878474754").send(embed);
    }

}
