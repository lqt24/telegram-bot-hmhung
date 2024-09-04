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
          const { name, description, usage, credits, cooldowns, alias} = command.config;
          const helpMessage = `
          Thông tin về lệnh: /${name}
          Mô tả: ${description}
          Cách sử dụng: ${usage}
          Credits: ${credits || 'Không có'}
          Cooldowns: ${cooldowns || 'Không có'}
	      Tên khác: ${alias || 'Không có'}
          `;
          bot.sendMessage(chatId, helpMessage.trim());
      } else {
          bot.sendMessage(chatId, "Lệnh không tồn tại.");
      }
  } else {
      let helpMessage = "Các lệnh có thể sử dụng:\n";
      commands.forEach((command) => {
          helpMessage += `/${command.config.name} - ${command.config.description}\n`;
      });
      bot.sendMessage(chatId, helpMessage.trim());
  }
};
