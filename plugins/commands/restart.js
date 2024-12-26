module.exports.config = {
  name: "restart",
  description: "Khởi động lại bot",
  isAdmin: true
}
module.exports.run = async function ({ bot, msg, args }) {
  await bot.sendMessage(msg.chat.id, "⌛ Đang khởi động lại bot...");
  process.exit(1);
}