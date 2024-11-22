const { createReadStream, unlinkSync, writeFileSync } = require("fs-extra");
const { resolve } = require("path");
const axios = require('axios');
process.env.NTBA_FIX_350 = true

module.exports.config = {
    name: "tts",
    version: "1.0.1",
    description: "Khiến bot trả về file âm thanh của chị Google thông qua văn bản.",
    usage: "/tts [ru/en/ko/ja] [Text]",
    cooldown: 5,
    credits: "Mirai Team, convert by Hà Mạnh Hùng"
};

module.exports.run = async ({ bot, msg, args }) => {
    try {
        const file = `${Date.now()}.mp3`

        const path = resolve(__dirname, 'cache', file);

        const content = args.join(" ");
        const languageToSay = (["ru", "en", "ko", "ja"].some(item => content.startsWith(item)))
            ? content.slice(0, content.indexOf(" "))
            : "vi";
        const text = (languageToSay !== "vi") ? content.slice(3) : content;

        const maxLength = 200;
        let audioData = Buffer.alloc(0);

        const chunks = [];
        let remainingText = text;
        while (remainingText.length > 0) {
            const chunk = remainingText.slice(0, maxLength);
            chunks.push(chunk);
            remainingText = remainingText.slice(maxLength);
        }

        for (const chunk of chunks) {
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${languageToSay}&client=tw-ob`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            audioData = Buffer.concat([audioData, response.data]);
        }

        writeFileSync(path, audioData);

        const fileOptions = {
            filename: file,
            contentType: "audio/mpeg"
        };
        const stream = await createReadStream(path)
        await bot.sendAudio(msg.chat.id, stream, { caption: "Tạo âm thanh thành công!", reply_to_message_id: msg.mesage_id }, fileOptions);

        unlinkSync(path);
    } catch (error) {
        console.error(error);
        await bot.sendMessage(msg.chat.id, "Đã xảy ra lỗi khi tạo file âm thanh!", { reply_to_message_id: msg.mesage_id });
    }
};
