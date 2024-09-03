module.exports.config = {
    name: "help",
    description: "Show list lệnh hiện có trong bot.",
    usage: "/help",
    isAdmin: false
  };
  
  module.exports.run = (bot, msg, args, commands) => {
    const chatId = msg.chat.id;
    let helpMessage = "Các lệnh có thể sử dụng:\n";
  
    commands.forEach((command) => {
      helpMessage += `/${command.config.name} - ${command.config.description}\n`;
    });
  
    bot.sendMessage(chatId, helpMessage);
  };
  