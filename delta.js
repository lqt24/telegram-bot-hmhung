const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const logger = require('./utils/log.js');
require('dotenv').config();

const bot = new TelegramBot(process.env.TOKEN, { polling: config.polling });

const commands = new Map();
const cooldowns = new Map(); 

const loadCommands = () => {
    const commandFiles = fs.readdirSync('./modules').filter(file => file.endsWith('.js'));
    let loadedCommandCount = 0;

    commandFiles.forEach(file => {
        try {
            const command = require(`./modules/${file}`);
            commands.set(command.config.name, command);
            if (command.config.alias && Array.isArray(command.config.alias)) {
                command.config.alias.forEach(alias => commands.set(alias, command));
            }
            loadedCommandCount++;
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
    const userId = msg.from.id;

    if (commands.has(commandName)) {
        const command = commands.get(commandName);

        if (command.config.isAdmin && !isAdmin(userId)) {
            bot.sendMessage(msg.chat.id, "Bạn không có quyền thực hiện lệnh này.");
            return;
        }

        const now = Date.now();
        const cooldownKey = `${commandName}-${userId}`;
        const cooldownAmount = (command.config.cooldowns || 0) * 1000; 
        if (cooldowns.has(cooldownKey)) {
            const expirationTime = cooldowns.get(cooldownKey) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                bot.sendMessage(msg.chat.id, `Vui lòng đợi ${timeLeft} giây trước khi sử dụng lại lệnh /${commandName}.`);
                return;
            }
        }

        cooldowns.set(cooldownKey, now);
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
