module.exports = function ({ msg, bot, commands}) {
  switch (msg.entities.type) {
    case "bot_command":
      require("./../handle/handleCommand")({bot, commands})
  }
}