const axios = require("axios");

module.exports.config = {
    name: "download",
    description: "Tải video Facebook, Tiktok,..",
    usage: "/download [link]",
    isAdmin: false,
    credits: "hmhung",
    cooldowns: 5
};

module.exports.run = async (bot, msg, args) => {
    const str = args.join(" ");
    if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
        const json = await infoPostTT(str);

        if (json.images) {
            bot.sendMessage(msg.chat.id, "Bot chưa hỗ trợ tải album!")
        }
        else if (json.play) {
            await bot.sendVideo(msg.chat.id, json.play, { caption: json.title });
        }
    } else if(/fb|facebook/.test(str)) {
        const response = await axios.get(`https://api.hamanhhung.site/download/facebook?url=${str}`);
        if (response) {
            bot.sendVideo(msg.chat.id, response.data.data.hd, { caption: response.data.data.title || "Không có tiêu đề." })
        }
    } else {
        bot.sendMessage(msg.chat.id, "URL không hợp lệ hoặc chưa được hỗ trợ.");
    }
}

async function infoPostTT(url) {
    const response = await axios({
        method: "post",
        url: `https://tikwm.com/api/`,
        data: { url },
        headers: { "content-type": "application/json" },
    });
    return response.data.data;
}
