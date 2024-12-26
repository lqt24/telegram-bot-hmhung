const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
global.config = config;
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
let botName;
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
            cmd.push({ command: command.config.name, description: command.config.description || "Không có mô tả" })
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

            if (event && event.type && event.name && event.execute) {
                bot.on(event.type, (msg, ...args) => {
                    const context = { bot, args, msg }; 
                    event.execute(context);
                });

                eventMap.set(event.type, event);
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
        botName = me.username;
        bot.on('polling_error', (error) => console.error('Lỗi khi polling:', error));
        logger.loader(`Bot đã săn sàng nhận lệnh: https://t.me/${me.username}/`);
    });
}
bot.on('message', (msg) => {
    require("./core/listen.js")({ msg, bot, commands, eventMap });
});
startBot();
loadCommands();
loadEvents();

module.exports = {
    loadCommands
}