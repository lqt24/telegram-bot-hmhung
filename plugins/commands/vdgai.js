const axios = require("axios")
const { error } = require("npmlog")

module.exports.config = {
    name: "gai",
    description: "Video gái",
    usage: "/gai"
}

module.exports.run = async(bot, msg) => {
    try {
    const res = await axios.get("https://api.hamanhhung.site/media/girl-video")
    const link = res.data.url
    bot.sendVideo(msg.chat.id, link, { caption: 'Ngắm thôi không húp được đâu.', reply_to_message_id: msg.message_id });
    } catch {
        bot.sendMessage(msg.chat.id, "Đã xảy ra lỗi!", { reply_to_message_id: msg.message_id });
    };
}