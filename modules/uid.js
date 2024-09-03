module.exports.config = {
    name: "uid",
    description: "Responds with the user ID",
    usage: "/uid",
    permission: 1 // Quyền truy cập: 0 - Member
  };
  
  module.exports.run = (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    bot.sendMessage(chatId, `Your user ID is: ${userId}`);
  };
  