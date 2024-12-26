const axios = require("axios");
const fbdl = require("fbdl.js");
const { decode } = require("html-entities");

module.exports = {
  name: "autodown",
  type: "message",
  async execute({ bot, msg }) {
    const str = msg.text;
    if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
      const json = await infoPostTT(str);

      if (json.images) {
        bot.sendMessage(msg.chat.id, "Bot hiện chưa hỗ trợ tải album!", {
          reply_to_message_id: msg.message_id,
        });
      } else if (json.play) {
        await bot.sendVideo(msg.chat.id, json.play, {
          caption: json.title,
          reply_to_message_id: msg.message_id,
        });
      }
    } else if (/fb|facebook/.test(str)) {
      const result = await fbdl(str);
      const encodedText = result.title;
      const decodedText = decode(encodedText);
      const videoUrl = result.hd;
      if (result) {
        bot.sendVideo(msg.chat.id, videoUrl, {
          caption: decodedText || "Không có tiêu đề.",
          reply_to_message_id: msg.message_id,
        });
      }
    }
  },
};

async function infoPostTT(url) {
  const response = await axios({
    method: "post",
    url: `https://tikwm.com/api/`,
    data: { url },
    headers: { "content-type": "application/json" },
  });
  return response.data.data;
}
