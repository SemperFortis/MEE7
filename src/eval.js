module.exports.run = async (Discord, msg, client, args, db, utils) => {
    const type = args[0];
    let toEval = args.slice(1).join(" ");
    const token = client.token || client.rest.client.token;
    const embed = new Discord.MessageEmbed();
    embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
    embed.setColor("#b7eeff")
    embed.setFooter(`ID: ${msg.author.id}`)
    client.fetchApplication().then(async (app) => {
        if (msg.author.id != app.owner.id) {
            return msg.channel.send("You are not the owner.")
        } else
            if (!type) {
                embed.setDescription(`**${msg.author.username}**, input Javascript code to evaluate. \n **Embed:** -e`)
                return msg.channel.send(embed);
            } else {
                try {
                    if (type == "-e") {
                        let evaled = eval(toEval);
                        if (typeof evaled != "string") evaled = require("util").inspect(evaled);
                        return await msg.channel.send(evaled.replace(token, "I think the fuck not"), { code: "javascript", split: true })
                    } else {
                        toEval = args.join(" ");
                        let evaled = eval(toEval);
                        if (typeof evaled != "string") evaled = require("util").inspect(evaled);
                        return await msg.channel.send(evaled.replace(token, "I think the fuck not"))
                    }
                } catch (e) {
                    return msg.channel.send(clean(e), { code: "javascript", split: true });
                }
            }
        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
    });
}

module.exports.config = {
    name: "eval",
    alias: ["inspect"],
    level: 3
}

