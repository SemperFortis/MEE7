const Canvas = require("canvas");
Canvas.registerFont("./Poppins-Regular.ttf", { family: "Poppins-Light", weight: 200 });

//eslint-disable-next-line no-unused-vars
module.exports.run = (Discord, msg, client, args, db, utils) => {
    db.MongoFind("guilds", { id: msg.guild.id }).then((server) => {
        let user = msg.guild.member((msg.mentions.users.first() || args[0])) || msg.guild.members.cache.find(u => u.user.tag === args.join(" "));
        if (!user) user = msg.author;
        if (user.user) user = user.user;
        server[0].users.map(async (x) => {
            // Found member we are looking for
            if (x.id == user.id) {
                await x;
                const canvas = Canvas.createCanvas(750, 235);
                const ctx = canvas.getContext("2d");
                ctx.save();
                ctx.save();
                // Base layer
                if (x.profile.background) {
                    const background = await Canvas.loadImage(x.profile.background);
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = "0.7";
                } else {
                    ctx.fillStyle = "#23272a";
                    ctx.fillRect(0, 0, 750, 235);
                }
                // 2nd layer
                ctx.fillStyle = "#090a0b";
                ctx.fillRect(20, 30, 710, 175);
                // Rank number 
                ctx.globalAlpha = "1";
                ctx.font = "20px Poppins-Light";
                ctx.fillStyle = "white";
                ctx.fillText("RANK", 710 - 50 - ctx.measureText("RANK").width - (ctx.measureText(`#${findRank(server[0].users, user) + 1}`).width * 2.5) - (ctx.measureText("LEVEL").width) - (ctx.measureText(x.level).width * 2.5), 85);
                ctx.font = "500 50px Poppins-Light";
                ctx.fillStyle = "white";
                ctx.fillText(`#${findRank(server[0].users, user) + 1}`, 710 - 40 - (ctx.measureText(`#${findRank(server[0].users, user) + 1}`).width) - (ctx.measureText("LEVEL").width / 2.5) - (ctx.measureText(x.level).width), 85);
                // Level
                ctx.font = "20px Poppins-Light";
                ctx.fillStyle = x.profile.color;
                ctx.fillText("LEVEL", 710 - 23 - (ctx.measureText("LEVEL").width) - (ctx.measureText(x.level).width * 2.5), 85);
                ctx.font = "500 50px Poppins-Light";
                ctx.fillText(x.level, 710 - 15 - ctx.measureText(x.level).width, 85);
                // Username
                ctx.font = "32px Poppins-Light";
                ctx.fillStyle = "#ffffff";
                ctx.fillText(user.username, 210, 135);
                // User discriminator
                ctx.font = "20px Poppins-Light";
                ctx.fillStyle = "gray";
                ctx.fillText(`#${user.discriminator}`, (ctx.measureText(user.username).width * 1.6) + 220, 135);
                // XP count
                ctx.font = "20px Poppins-Light";
                ctx.fillStyle = "white";
                // measure the width again
                ctx.fillText(x.xp >= 1000 ? `${(x.xp / 1000).toFixed(2)}K` : x.xp, 710 - 53 - ctx.measureText(`/ ${x.reqXp >= 1000 ? `${(x.reqXp / 1000).toFixed(2)}K` : x.reqXp}`).width - ctx.measureText(x.xp >= 1000 ? `${(x.xp / 1000).toFixed(2)}K` : x.xp).width, 135);
                ctx.font = "20px Poppins-Light";
                ctx.fillStyle = "gray";
                ctx.fillText(`/ ${x.reqXp >= 1000 ? `${(x.reqXp / 1000).toFixed(2)}K` : x.reqXp}`, 710 - 45 - ctx.measureText(`/ ${x.reqXp >= 1000 ? `${(x.reqXp / 1000).toFixed(2)}K` : x.reqXp}`).width  , 135);
                ctx.font = "20px Poppins-Light";
                ctx.fillStyle = "gray";
                ctx.fillText("XP", 710 - 40, 135);
                // Progress bar
                ctx.fillStyle = "gray";
                roundRect(ctx, 200, 150, 505, 30, 15);
                // Some actual filled color
                ctx.fillStyle = x.profile.color;
                roundRect(ctx, 200, 150, (x.xp / x.reqXp) * 505, 30, 15);
                ctx.restore();
                // Avatar
                ctx.beginPath();
                ctx.arc(105, 120, 65, 0, Math.PI * 2, true);
                ctx.lineWidth = 8;
                ctx.strokeStyle = "black";
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: "jpg" }));
                ctx.drawImage(avatar, 30, 55, 150, 150);
                ctx.restore();
                // User status
                drawStatus(ctx, user);
                return msg.channel.send(new Discord.MessageAttachment(canvas.toBuffer(), "rank.webp"));
            }
        });
    });
};

function roundRect(ctx, x, y, width, height, radius, border = false) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(x + radius, y + height);
    ctx.arc(x + radius, y + radius, radius, Math.PI / 2, 3 * Math.PI / 2, false);
    ctx.fill();
    if (border) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    ctx.clip();
}
function drawStatus(ctx, user) {
    ctx.beginPath();
    ctx.arc(155, 160, 17, 0, 360, false);
    switch (user.presence.status) {
    case "dnd":
        ctx.fillStyle = "#f04848";
        break;
    case "online":
        ctx.fillStyle = "#44b37f";
        break;
    case "idle":
        ctx.fillStyle = "#faa51b";
        break;
    case "offline":
        ctx.fillStyle = "#747f8d";
        break;
    }
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.stroke();
}
function findRank(array, user) {
    let sorted = array.sort((a, b) => {
        return b.level - a.level || b.xp - a.xp;
    });
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].id == user.id) {
            return i;
        }
    }
}

module.exports.config = {
    name: "level",
    alias: ["rank"],
    level: 2
};