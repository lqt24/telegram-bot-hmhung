module.exports.config = {
    name: "ping",
    description: "Bot sẽ trả lời lại pong.",
    usage: "/ping",
    isAdmin: false,
    credits: "Nguyên Blue, hmhung",
    cooldowns: 5
  };
  
  module.exports.run = async (bot, msg) => {
    const chatId = msg.chat.id;
    const startTime = Date.now();

    const sentMsg = await bot.sendMessage(chatId, "Wait...", { reply_to_message_id: msg.message_id });
    
    const endTime = Date.now();
    const ping = endTime - startTime;
  
    await bot.editMessageText(`Pong! ${ping}ms`, {
      chat_id: chatId,
      message_id: sentMsg.message_id
    });
  };
  
