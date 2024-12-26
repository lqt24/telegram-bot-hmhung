module.exports.config = {
  name: "uid",
  description: "Lấy uid người dùng.",
  usage: "/uid [@username]",
  credits: "hmhung",
  cooldowns: 5
};

module.exports.run = async ({ bot, msg, args }) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (msg.reply_to_message && msg.reply_to_message.from) {
    const taggedUserId = msg.reply_to_message.from.id;
    const abc = msg.reply_to_message.from;
    bot.sendMessage(chatId, `ID của người dùng ${abc.first_name} ${abc.last_name} là: <code>${taggedUserId}</code>`, { parse_mode: "HTML" });
  } else if (args.length > 0 && args[0].startsWith('@')) {
    const username = args[0].substring(1);
    try {
      const chatMember = await bot.getChatMember(chatId, username);
      bot.sendMessage(chatId, `ID của người dùng <code>${username}</code> là: <code>${chatMember.user.id}</code>`, { parse_mode: 'HTML' });
    } catch (error) {
      bot.sendMessage(chatId, `Lỗi`);
    }
  } else {
    bot.sendMessage(chatId, `ID của bạn là: <code>${userId}</code>`, { parse_mode: "HTML" });
  }
};
