const fs = require("fs");
const path = require("path");

function getStatus() {
    const data = fs.readFileSync(path.join("database", "ai_status.json"), "utf-8");
    return JSON.parse(data);  
}

function updateStatus(status) {
    fs.writeFileSync(path.join("database", "ai_status.json"), JSON.stringify(status, null, 2), "utf-8");
}

module.exports.config = {
    name: "ai",
    isAdmin: false,
    cooldowns: 5,
    description: "on/off AI.",
    credits: "hmhung",
    usage: "/ai",
};

module.exports.run = async ({ bot, msg }) => {
    const send = (content) => {
        bot.sendMessage(msg.chat.id, content, {
            reply_to_message_id: msg.message_id,
        });
    };

    const userId = msg.from.id;

    try {
        let status = getStatus();

        if (status.includes(userId)) {
            status = status.filter(id => id !== userId);
            updateStatus(status);
            send("AI đã được tắt. Bạn có thể sử dụng lệnh /ai để bật lại.");
        } else {
            status.push(userId);
            updateStatus(status);
            send("AI đã được bật. Bạn có thể sử dụng lệnh /ai để tắt.");
        }
    } catch (error) {
        console.error("Error updating AI status:", error);
        send("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
};
