const { chat } = require("../../utils/gemini")

module.exports.config = {
    name: "ai",
    isAdmin: false,
    cooldowns: 5,
    description: "Chat with AI",
    credits: "hmhung",
    usage: "ai [prompt]",
};
module.exports.run = async ({ bot, msg, args }) => {
    const send = (content) => {
        bot.sendMessage(msg.chat.id, content, {
            reply_to_message_id: msg.message_id
        });
    }

    if (!process.env.GEMINI_API) return send("Cạn kiệt tài nguyên!");
    const prompt = args.join(" ");
    if (!prompt) return send("Chưa nhập Prompt!");
    const result = await chat(prompt, msg.from.id);
    send(result);
};