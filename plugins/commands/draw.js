const axios = require("axios");
async function text2img(prompt) {
  try {
    const headers = {
      accept: "text/x-component",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "text/plain;charset=UTF-8",
      "next-action": "416e3295047f969ee11a9eebe66573be71178ee3",
      origin: "https://ai.codedao.cc",
      referer: "https://ai.codedao.cc/",
      "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    };

    const data = JSON.stringify([prompt, "square", true]);

    const response = await axios.post("https://ai.codedao.cc/", data, { headers });
    const responseData = response.data;

    const regex = /"imgUrl":"(https:\/\/[^"]+)"/;
    const match = responseData.match(regex);

    if (match && match[1]) {
      const imgUrl = match[1];
      return imgUrl
    } else {
      console.error("Không tìm thấy data.");
    }
  } catch (error) {
    console.error(error.message);
  }
};
module.exports.config = {
    name: "draw",
    isAdmin: false,
    cooldowns: 5,
    description: "Text-To-Image",
    credits: "hmhung",
    usage: "draw [text]",
};

module.exports.run = async ({ bot, msg, args }) => {
    const prompt = args.join(" ");
    const send = (content) => bot.sendMessage(msg.chat.id, content, { reply_to_message_id: msg.message_id });

    if (!prompt) {
        send("Thiếu gì điền đó ¯\\_(ツ)_/¯");
        return;
    }

    try {
        const response = await text2img(prompt);

        if (response) {
            bot.sendPhoto(msg.chat.id, response, {
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
