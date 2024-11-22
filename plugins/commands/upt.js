
const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const nodeDiskInfo = require('node-disk-info');

module.exports = {
    config: {
        name: "uptime",
        description: "Hiển thị thông tin hệ thống của bot!",
        usages: "",
        isAdmin: true,
        credits: "vtuan, hmhung",
        cooldowns: 0
    },
    run: async ({ bot, msg }) => {
        const ping = Date.now();
        async function getDependencyCount() {
            try {
                const packageJsonString = await fs.readFile('package.json', 'utf8');
                const packageJson = JSON.parse(packageJsonString);
                const depCount = Object.keys(packageJson.dependencies).length;
                return depCount;
            } catch (error) {
                console.error('❎ Không thể đọc file package.json:', error);
                return -1;
            }
        }
        function getStatusByPing(pingReal) {
            if (pingReal < 200) {
                return 'mượt';
            } else if (pingReal < 800) {
                return 'trung bình';
            } else {
                return 'mượt';
            }
        }
        function getPrimaryIP() {
            const interfaces = os.networkInterfaces();
            for (let iface of Object.values(interfaces)) {
                for (let alias of iface) {
                    if (alias.family === 'IPv4' && !alias.internal) {
                        return alias.address;
                    }
                }
            }
            return '127.0.0.1';
        }
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / (60 * 60));
        const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);
        const dependencyCount = await getDependencyCount();
        const botStatus = getStatusByPing(ping);
        const primaryIp = getPrimaryIP();
        try {
            const disks = await nodeDiskInfo.getDiskInfo();
            const firstDisk = disks[0] || {};
            const usedSpace = firstDisk.blocks - firstDisk.available;
            function convertToGB(bytes) {
                if (bytes === undefined) return 'N/A';
                const GB = bytes / (1024 * 1024 * 1024);
                return GB.toFixed(2) + 'GB';
            }
            const pingReal = Date.now() - ping
            const replyMsg = `⏰ Bây giờ là: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} | ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
⏱️ Thời gian đã hoạt động: ${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}
🗂️ Số lượng package: ${dependencyCount >= 0 ? dependencyCount : "Không xác định"}
🔣 Tình trạng bot: ${botStatus}
📋 Hệ điều hành: ${os.type()} ${os.release()} (${os.arch()})
💾 CPU: ${os.cpus().length} core(s) - ${os.cpus()[0].model} @ ${Math.round(os.cpus()[0].speed)}MHz
📊 RAM: ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB (đã dùng)
🛢️ Ram trống: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)}GB
🗄️ Storage: ${convertToGB(firstDisk.used)}/${convertToGB(firstDisk.blocks)} (đã dùng)
📑 Storage trống: ${convertToGB(firstDisk.available)}
🛜 Ping: ${pingReal}ms
  `.trim();
            bot.sendMessage(msg.chat.id, replyMsg, { reply_to_message_id: msg.message_id })
        } catch (error) {
            console.error('❎ Error getting disk information:', error.message);
        }
    }
};