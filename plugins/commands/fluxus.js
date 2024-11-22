const axios = require('axios');

module.exports.config = {
    name: "fluxus",
    description: "Bypass key flusuck",
    usage: "fluxus <link or HWID>",
    credits: "hmhung",
    cooldowns: 10
};

module.exports.run = async function ({ bot, msg, args }) {
    const chatId = msg.chat.id;
    const input = args.join(" ");

    if (!input) {
        return bot.sendMessage(chatId, "Thiếu gì thì điền đó!\n/fluxus <link or HWID>");
    }

    let hwid;

    // Kiểm tra xem input có phải là link Fluxus
    const fluxusLinkRegex = /^https:\/\/flux\.li\/android\/external\/start\.php\?HWID=/;
    if (fluxusLinkRegex.test(input)) {
        // Nếu là link, lấy HWID từ link
        const url = new URL(input);
        hwid = url.searchParams.get("HWID");
    } else {
        hwid = input.replace("HWID=", "");
    }

    if (!hwid) {
        return bot.sendMessage(chatId, "Liên kết không hợp lệ. Vui lòng cung cấp liên kết Fluxus hoặc HWID hợp lệ.");
    }

    try {
        const res = await axios.get(`https://stickx.top/api-fluxus/?hwid=${hwid}&api_key=E99l9NOctud3vmu6bPne`, {
            timeout: 120000
        });

        if (res.data && res.data.key) {
            await bot.sendMessage(
                chatId,
                `[ Fluxus Key Bypasser ]
────────────────
Key: ${res.data.key}`
            );
        } else {
            await bot.sendMessage(chatId, "Đã có lỗi xảy ra.");
        }
    } catch (e) {
        console.error("Error:", e);
        if (e.response && e.response.data) {
            await bot.sendMessage(chatId, `❌ Đã có lỗi xảy ra: ${e.response.data.message || e.message}`);
        } else {
            await bot.sendMessage(chatId, "❌ Đã có lỗi xảy ra!");
        }
    }
};
