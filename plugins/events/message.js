const aiAutoStt = require("./../../database/ai_status.json")
const { chat } = require("../../utils/gemini");

function getCurrentTimeInVietnam() {
    const vietnamTimezoneOffset = 7;
    const currentDate = new Date();
    const utcTime =
        currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
    const vietnamTime = new Date(utcTime + 3600000 * vietnamTimezoneOffset);

    const daysOfWeek = [
        "Chủ nhật",
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
    ];
    const day = daysOfWeek[vietnamTime.getDay()];
    const dateString = `${day} - ${vietnamTime.toLocaleDateString("vi-VN")}`;
    const timeString = vietnamTime.toLocaleTimeString("vi-VN");

    return `${dateString} - ${timeString}`;
}

module.exports = {
    name: 'message',
    async execute({ bot, msg }) {
        if (aiAutoStt.includes(msg.from.id)) {
            const send = (content) => {
                    bot.sendMessage(msg.chat.id, content, {
                        reply_to_message_id: msg.message_id,
                    });
                };
                const prompts = {
                    content: msg.text,
                    name: msg.from.first_name,
                    id: msg.from.id,
                    isAdmin: global.config.admins.includes(msg.from.id),
                    time: getCurrentTimeInVietnam()
                };
                const prompt = JSON.stringify(prompts);

                if (!process.env.GEMINI_API) return send("Không tìm thấy API key!");
                if (!prompt) return send("Chưa nhập Prompt!");
                const result = await chat(prompt, msg.from.id);
                send(result); 
        }
    }
};
