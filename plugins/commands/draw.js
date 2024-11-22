const axios = require("axios");

module.exports.config = {
    name: "draw",
    isAdmin: false,
    cooldowns: 5,
    description: "Text-To-Image",
    credits: "hmhung",
    usage: "draw [text]",
};

module.exports.run = async (bot, msg, args) => {
    const prompt = args.join(" ");
    const send = (content) => bot.sendMessage(msg.chat.id, content, { reply_to_message_id: msg.message_id });

    if (!prompt) {
        send("Thiếu gì điền đó ¯\\_(ツ)_/¯");
        return;
    }

    try {
        const response = await axios.get(`https://api.hamanhhung.site/ai/text2image?prompt=${encodeURI(prompt)}`);
        
        if (response.data && response.data.url) {
            bot.sendPhoto(msg.chat.id, response.data.url, {
                caption: "✨ Tạo ảnh thành công!",
                reply_to_message_id: msg.message_id,
            });
        } else {
            send("Không thể tạo ảnh. Vui lòng thử lại sau!");
        }
    } catch (error) {
        send("Đã có lỗi xảy ra :((");
        console.error("Lỗi khi gọi API:", error);
    }
};
