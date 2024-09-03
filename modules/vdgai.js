const axios = require("axios")

module.exports.config = {
    name: "gai",
    description: "Video gái",
    usage: "/gai"
}

module.exports.run = async(bot, msg) => {
    const res = await axios.get("https://c2x.site/media/girl-video")
    const link = res.data.url
    bot.sendVideo(msg.chat.id, link, { caption: 'Ngắm thôi không húp được đâu.' });

}