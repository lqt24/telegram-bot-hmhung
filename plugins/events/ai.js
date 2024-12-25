const fs = require("fs");
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

function getAiAutoStatus() {
    const filePath = "database/ai_status.json";
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading ai_status.json:", error);
        return []; 
    }
}

module.exports = {
    name: 'ai',
    async execute({ bot, msg }) {
        const aiAutoStt = getAiAutoStatus(); 
        if (msg.text && msg.text.startsWith(`${global.config.prefix}ai`)) return;
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
                time: getCurrentTimeInVietnam(),
            };
            const prompt = JSON.stringify(prompts);

            if (!process.env.GEMINI_API) return send("Không tìm thấy API key!");
            if (!prompt) return send("Chưa nhập Prompt!");

            try {
                const result = await chat(prompt, msg.from.id);
                send(result); 
            } catch (error) {
                console.error("Error occurred during chat API request:", error);
                send("Đã xảy ra lỗi trong quá trình yêu cầu API.");
            }
        }
    }
};
