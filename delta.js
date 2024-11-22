const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const logger = require('./utils/log.js');
const path = require("path");
require('dotenv').config();
const bot = new TelegramBot(process.env.TOKEN, { polling: config.polling });
if (!process.env.TOKEN) {
    console.warn("Không tìm thấy token trong biến môi trường!")
    process.exit(0)
};
const eventMap = new Map();
const commands = new Map();
const cooldowns = new Map();

global.delta = {
    handleReply: []
}

let cmd = []
const loadCommands = () => {
    const commandFiles = fs.readdirSync('./plugins/commands/').filter(file => file.endsWith('.js'));
    let loadedCommandCount = 0;

    commandFiles.forEach(file => {
        try {
            const command = require(`./plugins/commands/${file}`);
            if (commands.has(command.config.name)) {
                console.warn(`Đã tồn tại lệnh ${command.config.name} nên sẽ bỏ qua!`);
                return;
            }
            commands.set(command.config.name, command);
            if (command.config.alias && Array.isArray(command.config.alias)) {
                command.config.alias.forEach(alias => commands.set(alias, command));
            }
            loadedCommandCount++;
            cmd.push({ command: command.config.name, description: command.config.description })
        } catch (error) {
            console.error(`Lỗi khi tải lệnh ${file}:`, error.message);
        }
    });
    bot.setMyCommands(cmd)
    logger.loader(`Đã tải thành công ${loadedCommandCount}/${commandFiles.length} lệnh.`);
};


const eventsDir = './plugins/events';

const loadEvents = () => {
    const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));
    let loadedEvents = 0;

    eventFiles.forEach(file => {
        try {
            const event = require(`${eventsDir}/${file}`);

            if (event && event.name && event.execute) {
                bot.on(event.name, (msg, ...args) => {
                    const context = { bot, args, msg }; // Gói bot và các tham số vào object
                    event.execute(context);
                });
                
                 eventMap.set(event.name, event);
                loadedEvents++;
            } else {
                console.error(`Sự kiện từ file ${file} không hợp lệ.`);
            }
        } catch (error) {
            console.error(`Lỗi khi tải sự kiện từ file ${file}:`, error.message);
        }
    });

    logger.loader(`Đã tải ${loadedEvents}/${eventFiles.length} sự kiện.`);
};
async function startBot() {
    bot.getMe().then((me) => {
        bot.on('polling_error', (error) => console.error('Lỗi khi polling:', error));
        logger.loader(`Bot đã săn sàng nhận lệnh: https://t.me/${me.username}/`);
    });
}
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
            command.run({ bot, msg, args, commands });
        } catch (error) {
            bot.sendMessage(msg.chat.id, "Đã xảy ra lỗi khi thực thi lệnh.");
            console.error(`Lỗi khi thực hiện lệnh ${commandName}:`, error);
        }
    } else {
        bot.sendMessage(msg.chat.id, "Lệnh không tồn tại!", { reply_to_message_id: msg.message_id });
    }
});
startBot();
loadCommands();
loadEvents();

module.exports = {
    loadCommands
}
