const GoogleAuthenticator = require("../../utils/Authenticator");

module.exports = {
    config: {
        name: "2fa",
        credits: "Nguyên Blue",
        cooldowns: 3,
        description: "Giải mã 2FA.",
    },
    run: async ({ bot, msg, args }) => {
        const key = args.join(" ");

        if (!key) {
            return bot.sendMessage(
                msg.chat.id,
                "Vui lòng nhập code 2FA.\n<code>/2fa [mã bí mật của bạn]</code>",
                {
                    reply_to_message_id: msg.message_id,
                    parse_mode: "HTML",
                },
            );
        }

        try {
            const ga = new GoogleAuthenticator();
            const code = ga.getCode(key);

            return bot.sendMessage(
                msg.chat.id,
                `Giải mã thành công: <code>${code}</code>`,
                { parse_mode: "HTML", reply_to_message_id: msg.message_id },
            );
        } catch (error) {
            console.error("Lỗi khi giải mã:", error.message);
            return bot.sendMessage(
                msg.chat.id,
                "Lỗi khi giải mã. Vui lòng kiểm tra lại mã 2FA của bạn.",
                {
                    parse_mode: "HTML",
                    reply_to_message_id: msg.message_id,
                },
            );
        }
    },
};
