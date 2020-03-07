module.exports = client => {
    client.user.setActivity("users level up", { type: "WATCHING" });
    console.log(`[SUCCESS]: ${client.user.username} has been connected successfully.`);
};