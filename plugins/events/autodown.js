const axios = require("axios");
module.exports = {
  name: "autodown",
  async execute({ bot,msg }) {
        const str = msg.text;
    console.log(str)
        if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
            const json = await infoPostTT(str);

            if (json.images) {
                bot.sendMessage(msg.chat.id, "Bot hiện chưa hỗ trợ tải album!", { reply_to_message_id: msg.message_id })
            }
            else if (json.play) {
                await bot.sendVideo(msg.chat.id, json.play, { caption: json.title, reply_to_message_id: msg.message_id });
            }
        } else if (/fb|facebook/.test(str)) {
            const response = await axios.get(`https://api.hamanhhung.site/download/facebook?url=${str}`);
            if (response) {
                bot.sendVideo(msg.chat.id, response.data.data.hd, { caption: response.data.data.title || "Không có tiêu đề.", reply_to_message_id: msg.message_id })
            }
        } else {
            bot.sendMessage(msg.chat.id, "URL không hợp lệ hoặc chưa được hỗ trợ.", { reply_to_message_id: msg.message_id });
        }
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