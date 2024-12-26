module.exports = function ({ msg, bot, commands }) {
  if (msg.entities.type == "bot_command") {
  require("./handle/handleCommand.js")({ bot, commands, msg });
  } else {
  require("./handle/handleEvent.js")({ bot, msg });
  }
};
