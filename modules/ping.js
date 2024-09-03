module.exports.config = {
    name: "ping",
    description: "Bot sẽ trả lời lại pong",
    usage: "/ping",
    isAdmin: false  // Thay đổi thành true nếu lệnh này cần quyền admin
  };
  
  module.exports.run = async (bot, msg) => {
    const chatId = msg.chat.id;
    const startTime = Date.now();
    
    // Gửi tin nhắn "Wait..."
    const sentMsg = await bot.sendMessage(chatId, "Wait...");
    
    const endTime = Date.now();
    const ping = endTime - startTime;
  
    // Cập nhật tin nhắn "Wait..." với thời gian ping
    await bot.editMessageText(`Pong! ${ping}ms`, {
      chat_id: chatId,
      message_id: sentMsg.message_id
    });
  };
  