module.exports.config = {
  name: "uid",
  description: "Responds with the user ID or the ID of a tagged user",
  usage: "/uid [@username]",
  credits: "hmhung",
  cooldowns: 5
};

module.exports.run = async (bot, msg, args) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (msg.reply_to_message && msg.reply_to_message.from) {
    // Trả về ID của người dùng được tag (trả lời)
    const taggedUserId = msg.reply_to_message.from.id;
    const abc = msg.reply_to_message.from;
    bot.sendMessage(chatId, `ID của người dùng ${abc.first_name} ${abc.last_name} là: ${taggedUserId}`);
  } else if (args.length > 0 && args[0].startsWith('@')) {
    // Trả về ID của người dùng được tag qua username
    const username = args[0].substring(1); // Loại bỏ ký tự '@' khỏi username
    try {
      const chatMember = await bot.getChatMember(chatId, username);
      bot.sendMessage(chatId, `ID của người dùng ${username} là: ${chatMember.user.id}`);
    } catch (error) {
      bot.sendMessage(chatId, `Chưa hỗ trợ tag.`);
    }
  } else {
    // Không có tag, trả về ID của người gửi tin nhắn
    bot.sendMessage(chatId, `ID của bạn là: ${userId}`);
  }
};
