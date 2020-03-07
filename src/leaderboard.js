/* eslint-disable no-unused-vars */
const Canvas = require("canvas");
const canvas = Canvas.createCanvas(850, 700);
const ctx = canvas.getContext("2d");

module.exports.run = async (Discord, msg, client, args, db, utils) => {
    ctx.save();
    let servers = await db.MongoFind("guilds", { id: msg.guild.id });
    let depth = args[0];
    if (!depth) depth = 1;
    let users = sort(servers, depth);
    let t = "";
    if (users.length == 0) return msg.channel.send("No users found.");
    makeBackground(users.length);
    let ranAmt = 0;
    users.forEach(u => {
        drawCard(u, ranAmt, msg, Discord);
        ranAmt++;
        t += u.username + " " + u.level + " " + u.xp + "xp\n";
        // msg.guild.members.get(u.id).user.tag 
    });
    ctx.restore();
    // msg.channel.send(t);
    return msg.channel.send(new Discord.MessageAttachment(canvas.toBuffer(), "leaderboard.webp"));
};


function makeBackground(length) {
    ctx.canvas.height = length * 160;
    ctx.fillStyle = "#23272a";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

async function drawCard(user, i, msg, Discord) {
    if (user.profile.background) {
        const bg = await Canvas.loadImage(user.profile.background);
        ctx.drawImage(bg, 0, i * 160, canvas.width, 160);
        ctx.save();
    }

    ctx.fillStyle = "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
    ctx.fillRect(0, i * 160, canvas.width, 160);
}

function sort(obj, depth) {
    let sorted = obj[0].users.sort((a, b) => {
        return b.level - a.level || b.xp - a.xp;
    });
    let editedObj = [];
    let start = depth * 6 - 6;
    for (let i = start; i < depth * 6; i++) {
        if (i >= sorted.length) break;
        editedObj.push(sorted[i]);
    }
    return editedObj;
}

module.exports.config = {
    name: "leaderboard",
    alias: ["lb", "top"],
    level: 2
};