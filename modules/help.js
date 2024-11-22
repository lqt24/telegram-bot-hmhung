module.exports.config = {
    name: "help",
    description: "Hiển thị danh sách các lệnh hiện có hoặc thông tin chi tiết về một lệnh.",
    usage: "/help [tên lệnh]",
    isAdmin: false,
    credits: "hmhung",
    cooldowns: 20
};

module.exports.run = (bot, msg, args, commands) => {
    const chatId = msg.chat.id;
    const commandName = args[0];

    if (commandName) {
        const command = commands.get(commandName.toLowerCase());
        if (command) {
            const { name, description, usage, credits = 'Không có', cooldowns = 'Không có', alias = 'Không có' } = command.config;
            const helpMessage = `
            Thông tin về lệnh: "${name}"
            Mô tả: ${description}
            Cách sử dụng: ${usage}
            Credits: ${credits}
            Cooldowns: ${cooldowns}
            Tên khác: ${alias}
            `;
            bot.sendMessage(chatId, helpMessage.trim());
        } else {
            bot.sendMessage(chatId, "Lệnh không tồn tại.");
        }
    } else {
        const totalCommands = commands.size;  // Tổng số lệnh
        const helpMessage = `Tổng số lệnh hiện có: ${totalCommands}\nCác lệnh có thể sử dụng:\n\n${Array.from(commands.values())
                .map((command) => `/${command.config.name} - ${command.config.description}`)
                .join("\n")}
        `;
        bot.sendMessage(chatId, helpMessage.trim());
    }
};
