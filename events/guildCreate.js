const { MongoFind: find, MongoInsert: insert } = require("../util/db.js");

module.exports = guild => {
    find("guilds", { id: guild.id }).then((server) => {
        if (server.length == 0) {
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

    // Welcome embed
    //const welcome = new Discord.MessageEmbed();

    // const embed = util.embed();
    // embed.setAuthor(guild.me.user.tag, guild.me.user.displayAvatarURL())
    // embed.setDescription(`🌟 Ranging from economy to moderation, explore all 180+ commands to enhance your server experience! To get started, send **+help** \n ${upvote} [**Upvote**](https://top.gg/bot/590315030470328321/vote) me every 12 hours to get additional shiny rewards! \n ${lvl4} Become a [**donator**](https://www.patreon.com/xeonbot) to unlock custom embed editors, autoposting, automated server games and more. \n ${botIcon} Have any questions? Join the [**support server**](https://discord.gg/Cgsyn6m)!`)
    // embed.setColor('#b7eeff')
    // embed.setFooter(`ID: ${guild.me.user.id}`)
    // users.addGuild(guild);
    // const available = [];
    // guild.channels.filter(x => x.type == 'text').forEach(x => {
    //     if (guild.me.permissionsIn(x).has(['ATTACH_FILES'])) available.push(x.id);
    // });
    // available[0] != undefined ? guild.channels.get(available[0]).send(embed) : guild.owner.send(embed).catch(() => { });
}
