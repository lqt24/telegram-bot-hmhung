module.exports = async function ({ bot, commands, msg }) {
    const cooldowns = new Map();

    const isAdmin = global.config.admins.includes(msg.from.id);
    if (!msg.text || !msg.text.startsWith(global.config.prefix)) return;

    const args = msg.text.slice(global.config.prefix.length).trim().split(" ");
    let commandName = args.shift().toLowerCase();
    const userId = msg.from.id;

    // Lấy username của bot
    const botInfo = await bot.getMe();
    const botUsername = botInfo.username;

    // Loại bỏ tên bot nếu có
    if (commandName.includes("@")) {
        const [baseCommand, mentionedBot] = commandName.split("@");
        if (mentionedBot.toLowerCase() === botUsername.toLowerCase()) {
            commandName = baseCommand; // Chỉ lấy tên lệnh
        } else {
            return; // Nếu lệnh không phải dành cho bot này, bỏ qua
        }
    }

    if (commands.has(commandName)) {
        const command = commands.get(commandName);

        if (command.config.isAdmin && !isAdmin) {
            bot.sendMessage(
                msg.chat.id,
                "Bạn không có quyền thực hiện lệnh này.",
            );
            return;
        }

        const now = Date.now();
        const cooldownKey = `${commandName}-${userId}`;
        const cooldownAmount = (command.config.cooldowns || 0) * 1000;
        if (cooldowns.has(cooldownKey)) {
            const expirationTime = cooldowns.get(cooldownKey) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                bot.sendMessage(
                    msg.chat.id,
                    `Vui lòng đợi ${timeLeft} giây trước khi sử dụng lại lệnh /${commandName}.`,
                );
                return;
            }
        }

        cooldowns.set(cooldownKey, now);
        try {
            command.run({ bot, msg, args, commands });
        } catch (error) {
            bot.sendMessage(msg.chat.id, "Đã xảy ra lỗi khi thực thi lệnh.");
            console.error(`Lỗi khi thực hiện lệnh ${commandName}:`, error);
        }
    } else {
        bot.sendMessage(msg.chat.id, "Lệnh không tồn tại!", {
            reply_to_message_id: msg.message_id,
        });
    }
};
