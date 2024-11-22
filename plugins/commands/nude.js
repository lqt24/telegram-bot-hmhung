const axios = require("axios");

module.exports = {
    config: {
        name: "nude",
        description: "Như cái tên",
        usage: "/nude",
        credits: "hmhung",
        cooldowns: 5
    },
    run: async ({ bot, msg }) => {
        try {

            const imgsex = await axios.get("https://api.sumiproject.net/images/nude");
            const imgsex_link = imgsex.data.url;
            const videosex = await axios.get("https://api.sumiproject.net/video/videosex");
            const videosex_link = videosex.data.url;
            const chatId = msg.chat.id;

            const sentMessage = await bot.sendMessage(chatId, 'Chọn đê :>', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Video nude', callback_data: 'option_1' }],
                        [{ text: 'Ảnh nude', callback_data: 'option_2' }]
                    ]
                }
            });

            const callbackQueryHandler = async (query) => {
                const { data, message } = query;

                if (data === 'option_1') {
                    await bot.sendVideo(chatId, videosex_link, { caption: 'Video sex của bạn đây.' });
                } else if (data === 'option_2') {
                    await bot.sendPhoto(chatId, imgsex_link, { caption: 'Ảnh sex của bạn đây.' });
                }

                await bot.deleteMessage(chatId, sentMessage.message_id);

                bot.off('callback_query', callbackQueryHandler);
            };

            bot.on('callback_query', callbackQueryHandler);

        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
        }
    }
};
