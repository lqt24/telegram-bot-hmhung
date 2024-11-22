module.exports.config = {
    name: "girl",
    description: "Xem ảnh gái",
    usage: "/girl"
};

const girls = require("./../../database/media/girl.json");

module.exports.run = async ({ msg, bot }) => {
    const girl = girls[Math.floor(Math.random() * girls.length)];
    bot.sendPhoto(msg.chat.id, girl, { caption: "Xinh quá ta", reply_to_message_id: msg.message_id })
}