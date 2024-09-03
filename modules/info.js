module.exports.config = {
    name: "info",
    description: "Displays information about the message in JSON format",
    usage: "/info"
  };
  
  module.exports.run = (bot, msg) => {
    const chatId = msg.chat.id;
    
    // Chuyển đổi thông tin của biến msg thành JSON
    const msgInfo = JSON.stringify(msg, null, 2);
    
    // Gửi thông tin JSON đến nhóm hoặc chat
    bot.sendMessage(chatId, `Here is the message info:\n\`\`\`\n${msgInfo}\n\`\`\``, {parse_mode: 'MarkdownV2'});
  };