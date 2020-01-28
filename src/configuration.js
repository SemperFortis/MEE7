module.exports.run = (Discord, msg, client, args, db, utils) => {
    let permissions = msg.member.permissions.toArray().map((role) => role.replace(/_/g, ""));
    db.MongoFind("guilds", { id: msg.guild.id }).then((server) => {
        const filter = m => m.author == msg.author.id;
        switch (args[0]) {
            case "-color": case "-c":
                msg.channel.send(":speech_left: What color would you like to set your rank card to? \n :x: Type **cancel** to cancel the command.");
                msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then((message) => {
                    server[0].users.map((user) => {
                        if (user.id == msg.author.id) {
                            let response = message.first().content.toLowerCase();
                            if (/^#[0-9A-F]{6}$/i.test(response)) {
                                user.profile.color = response;
                                db.MongoUpdate("guilds", { id: msg.guild.id }, { "users": server[0].users });
                                msg.channel.send(`Success! Your rank color has been set to **${response}**`);
                                return;
                            }
                            else if (response == "cancel") return msg.reply("the command has been canceled.");
                            else return msg.reply("that is not a valid hex code!");
                        }
                    });
                }).catch(() => { return msg.reply("you took too long to respond. The command has been canceled."); });
                break;
            case "-background": case "-bg":
                msg.channel.send("What background would you like to set for your rank card?");
                msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then((message) => {
                    server[0].users.map((user) => {
                        if (user.id == msg.author.id) {
                            user.profile.background = message.first().attachments.first().url;
                            db.MongoUpdate("guilds", { id: msg.guild.id }, { "users": server[0].users });
                            msg.channel.send(`Success! Your rank background has been set.`);
                        }
                    });
                }).catch(() => { return msg.reply("You took too long to respond. The command has been canceled."); });
                break;
            case "-t": case "-time":
                if (permissions.includes("ADMINISTRATOR")) {
                    let time = args[1];
                    time = convert(time.slice(0, -1), time.slice(-1));
                    if (!time) return msg.channel.send(`The time: \`${args[1]}\` is an unknown time format, time formats are in minutes and seconds\nEx: 5m \`(5 minutes)\` or 5s \`(seconds)\`.`) // Just tests going to be falsely
                    if (time == "unknown") return msg.channel.send(`The time you have specified is either less than 10 seconds, greater than 20 minutes, or not a number.`);
                    msg.channel.send(`You will now gain XP every ${args[1]}.`);
                    db.MongoUpdate("guilds", { id: msg.guild.id }, { "settings.xpInt": time });
                }
                break;
            default:
                msg.channel.send(`:speech_left: **${msg.author.username}**, that is not a valid option.\n:triangular_flag_on_post: Specify one of the available flags: **-color**, **-bg**`);
                break;
        }
    });
}

function convert(time, type) {
    time = Math.round(time);
    if (type == 's') {
        if (time > 9 && time < 1201) return time * 1000;
        else return "unknown";
    }
    else if (type == 'm') {
        if (time >= 1 && time < 21) return time * 60000;
        else return "unknown";
    }
    else return undefined;
}

module.exports.config = {
    name: "configuration",
    alias: ["config", "settings"],
    level: 2
}