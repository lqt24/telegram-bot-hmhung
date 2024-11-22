module.exports.config = {
  name: "info",
  description: "Gì vậy",
  usage: "/info",
  isAdmin: true
};

module.exports.run = ({ bot, msg }) => {
  const chatId = msg.chat.id;

  const msgInfo = JSON.stringify(msg, null, 2);

  bot.sendMessage(chatId, `Here is the message info:\n\`\`\`\n${msgInfo}\n\`\`\``, { parse_mode: 'MarkdownV2' });
};
