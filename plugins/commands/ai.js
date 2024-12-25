const fs = require("fs");
function getStatus() {
    fs.readFileSync(path.join(__dirname, "ai_status.json"), "utf-8")
}
module.exports.config = {
    name: "ai",
    isAdmin: false,
    cooldowns: 5,
    description: "Chat with AI",
    credits: "hmhung",
    usage: "ai [prompt]",
};
module.exports.run = async ({ bot, msg, args }) => {
    const send = (content) => {
        bot.sendMessage(msg.chat.id, content, {
            reply_to_message_id: msg.message_id,
        });
    };
    if 
};
