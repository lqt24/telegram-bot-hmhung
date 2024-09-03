const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const logger = require('./utils/log.js');//logger by Niiozic

const bot = new TelegramBot(config.token, { polling: config.polling });

const commands = new Map();

const loadCommands = () => {
  const commandFiles = fs.readdirSync('./modules').filter(file => file.endsWith('.js'));
  let loadedCommandCount = 0;

  commandFiles.forEach(file => {
    try {
      const command = require(`./modules/${file}`);
      commands.set(command.config.name, command);
      loadedCommandCount++;
      logger.loader(`Đã tải lệnh: ${command.config.name}`);
    } catch (error) {
      console.error(`Lỗi khi tải lệnh ${file}:`, error.message);
    }
  });

  logger.loader(`Đã tải thành công ${loadedCommandCount}/${commandFiles.length} lệnh.`);
};

bot.on('polling_error', (error) => console.error('Lỗi khi polling:', error));
bot.getMe().then((me) => {
  logger.loader(`Đăng nhập thành công tại: @${me.username}`);
});

const isAdmin = (userId) => {
  return config.admins.includes(userId); 
};

bot.on('message', (msg) => {
  if (!msg.text || !msg.text.startsWith(config.prefix)) return; 

  const args = msg.text.slice(config.prefix.length).trim().split(" ");
  const commandName = args.shift().toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);

    if (command.config.isAdmin && !isAdmin(msg.from.id)) {
      bot.sendMessage(msg.chat.id, "Bạn không có quyền thực hiện lệnh này.");
      return;
    }

    try {
      command.run(bot, msg, args, commands); 
    } catch (error) {
      bot.sendMessage(msg.chat.id, "Đã xảy ra lỗi khi thực thi lệnh.");
      console.error(`Lỗi khi thực hiện lệnh ${commandName}:`, error);
    }
  } else {
    bot.sendMessage(msg.chat.id, "Lệnh không tồn tại!");
  }
});

loadCommands(); 
